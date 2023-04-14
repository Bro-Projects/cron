import type { context } from '@typings';
import type { MessageCreateOptions, MessagePayload } from 'discord.js';
import { renderHourlyEmbed } from '@renderers';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class HourlyTask extends GenericTask {
  interval = '0 * * * *';

  async task(this: context): Promise<void> {
    if (this.config.modOnly) return null;
    const lotteryHooks = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('hourly');
    const postWebhooks = (
      renderedResult: string | MessagePayload | MessageCreateOptions
    ) =>
      Promise.all(
        lotteryHooks.map((hook) =>
          this.client
            .sendWebhookMessage(hook.hookID, hook.token, renderedResult)
            .catch((err: Error) =>
              log(`[ERROR] Error while posting results: ${err.message}`)
            )
        )
      );

    // render results
    if (!lotteryResult) {
      const renderResult = renderHourlyEmbed(lotteryResult);
      await postWebhooks(renderResult);
      return log(`[INFO] Successfully posted hourly lottery.`);
    }

    // minus fees
    const { winnerID, amountWon, fee } = lotteryResult;
    const amountWonWithoutFees = amountWon - fee;

    // database stuff
    await this.db.addLotteryWin(winnerID, amountWonWithoutFees);
    await this.db.users.updateCooldown(winnerID, 'hourly');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.getRESTUser(winnerID);
    const renderResult = renderHourlyEmbed(lotteryResult, {
      wins,
      ...user
    });
    await postWebhooks(renderResult);

    // reset lottery
    await this.db.lotteries.reset('hourly');

    // dm winner
    await this.client.dm(winnerID, renderResult);
    log(`[INFO] Successfully posted hourly lottery.`);

    // auto lottery
    const autoUsers = await this.db.users.getValidHourlyAutoLotteryUserIDs();
    if (!autoUsers.length) {
      return log('[Hourly] No valid auto lottery users found.');
    }
    const hourlyUserIDs: string[] = autoUsers.map((user) => user._id);

    await this.db.enterAutoLotteryUsers(hourlyUserIDs, 'hourly', 100000);
    return log(
      `Hourly auto-lottery for ${hourlyUserIDs.length} users have been updated`
    );
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
