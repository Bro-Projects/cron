import type { context } from '../typings';
import { renderWeeklyEmbed } from '../renderers';
import { prettyDate } from '../utils';
import GenericTask from './genericTask';

export default class WeeklyTask extends GenericTask {
  interval = '30 11 * * Sun';

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
    this.client
      .executeWebhook(hookID, token, {
        ...renderResult,
      })
      .catch((err) =>
        console.error(`[ERROR] Error while posting results: ${err.message}`),
      );

    // reset weekly lottery
    await this.db.resetWeekly();

    //dm winner
    const channel = await this.client.getDMChannel(userID);
    await this.client
      .dm(channel.id, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err) =>
        console.error(`[ERROR] Error sending DM: ${err.message}`),
      );

    console.log(`[INFO] Successfully posted weekly lottery at ${prettyDate()}`);
    return null;
  }

  start(context: context): void {
    console.log(`[INFO] Started weekly task at ${prettyDate()}`);
    super.start(context);
  }
}
