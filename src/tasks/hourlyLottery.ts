import { renderHourlyEmbed } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import type { MessageCreateOptions, MessagePayload } from 'discord.js';
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
      const renderResult = await renderHourlyEmbed(lotteryResult);
      await postWebhooks(renderResult);
      return log(`[INFO] Successfully posted hourly lottery. (no entries)`);
    }

    // minus fees
    const { winnerID, amountWon, fee } = lotteryResult;
    const amountWonWithoutFees = amountWon - fee;

    // database stuff
    await this.db.addLotteryWin(winnerID, amountWonWithoutFees);
    await this.db.users.updateCooldown(winnerID, 'hourly');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.users.fetch(winnerID, { force: true });
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
    const hourlyUserIDs = await this.db.users.getValidAutoLotteryUserIDs(
      'hourly'
    );
    if (!hourlyUserIDs.length) {
      return log('[ERROR] No valid auto lottery users found.');
    }

    await this.db.enterAutoLotteryUsers(hourlyUserIDs, 'hourly', 100_000);
    return log(
      `[INFO] Hourly auto-lottery for ${hourlyUserIDs.length} users have been updated`
    );
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
