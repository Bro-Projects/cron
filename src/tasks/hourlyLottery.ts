import type { context } from '../typings';
import { renderHourlyEmbed } from '../renderers';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class HourlyTask extends GenericTask {
  interval = '0 * * * *';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('hourly');

    // render results
    if (!lotteryResult) {
      const renderResult = renderHourlyEmbed(lotteryResult);
      await this.client
        .executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err: Error) =>
          log(`[ERROR] Error while posting results: ${err.message}`),
        );
      log(`[INFO] Successfully posted hourly lottery.`);
      return null;
    }

    const { winnerID, amountWon } = lotteryResult;
    await this.db.users.addLotteryWin(winnerID, amountWon);
    await this.db.users.updateCooldown(winnerID, 'hourly');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.getRESTUser(winnerID);
    const renderResult = renderHourlyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    await this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.lotteries.reset('hourly');

    // dm winner
    await this.client
      .sendDM(winnerID, renderResult)
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted hourly lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
