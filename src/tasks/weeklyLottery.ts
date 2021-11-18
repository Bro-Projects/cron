import type { context } from '../typings';
import { renderWeeklyEmbed } from '../renderers';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class WeeklyTask extends GenericTask {
  interval = '0 0 * * Sun'; // at 12pm GMT every Sunday

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.getWeeklyStats();
    const userID = lotteryResult.winnerID;
    await this.db.addWeeklyWin(userID, lotteryResult.amountWon);
    await this.db.updateCooldown(userID, 'weekly');
    const wins = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);

    // render results
    const renderResult = renderWeeklyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    await this.client
      .executeWebhook(hookID, token, {
        ...renderResult,
      })
      .catch((err: Error) =>
        log(`[ERROR] Error while posting results: ${err.message}`),
      );

    // reset weekly lottery
    await this.db.resetWeekly();

    //dm winner
    await this.client
      .sendDM(userID, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted weekly lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started weekly task.`);
    super.start(context);
  }
}
