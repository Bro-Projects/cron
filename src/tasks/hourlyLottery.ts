import type { context } from '@typings';
import type { WebhookPayload } from 'eris';
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

    const postWebhooks = (renderedResult: WebhookPayload) =>
      Promise.all(
        lotteryHooks.map((hook) =>
          this.client
            .executeWebhook(hook.hookID, hook.token, {
              ...renderedResult
            })
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

    const { winnerID, amountWon } = lotteryResult;
    await this.db.addLotteryWin(winnerID, amountWon);
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
    const winnerDM = await this.client.getDMChannel(winnerID);
    await winnerDM
      .createMessage(renderResult)
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));
    log(`[INFO] Successfully posted hourly lottery.`);

    const validautoLotteryUserIDs =
      await this.db.users.getValidAutoLotteryUserIDs();
    if (!validautoLotteryUserIDs.length) return null;

    const userIDs: string[] = validautoLotteryUserIDs.map((user) => user._id);
    if (!userIDs.length) return null;

    // auto lottery users
    await this.db.enterAutoLotteryUsers(userIDs);
    return log(`Auto-lottery for ${userIDs.length} users has been updated`);
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
