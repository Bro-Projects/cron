import type { context } from '@typings';
import type { WebhookPayload } from 'eris';
import { renderHourlyEmbed } from '@renderers';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class HourlyTask extends GenericTask {
  interval = '0 * * * *';

  async task(this: context): Promise<void> {
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
      log(`[INFO] Successfully posted hourly lottery.`);
      return null;
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
    //dm winner
    const winnerDM = await this.client.getDMChannel(winnerID);
    await winnerDM
      .createMessage(renderResult)
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));
    return log(`[INFO] Successfully posted hourly lottery.`);
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
