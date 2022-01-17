import type { context } from '../typings';
import { renderWeeklyEmbed } from '../renderers';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class WeeklyTask extends GenericTask {
  interval = '30 11 * * Sun';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('weekly');
    const { winnerID, amountWon } = lotteryResult;
    await this.db.users.addWeeklyWin(winnerID, amountWon);
    await this.db.users.updateCooldown(winnerID, 'weekly');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.getRESTUser(winnerID);

    // render results
    const renderResult = renderWeeklyEmbed(lotteryResult, {
      wins,
      ...user
    });
    await this.client
      .executeWebhook(hookID, token, {
        ...renderResult
      })
      .catch((err: Error) =>
        log(`[ERROR] Error while posting results: ${err.message}`)
      );

    // reset weekly lottery
    await this.db.lotteries.reset('weekly');

    //dm winner
    await this.client
      .sendDM(winnerID, renderResult)
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted weekly lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started weekly task.`);
    super.start(context);
  }
}
