import { renderLotteryEmbed } from '../renderers';
import { context } from '../typings';
import { prettyDate } from '../utils';
import GenericTask from './genericTask';

export default class WeeklyTask extends GenericTask {
  interval = '30 10 * * Sun';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;
    // get results
    const lotteryResult = await this.db.getWeeklyLotteryStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderLotteryEmbed(lotteryResult);
      this.client
        .executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err) =>
          console.error(`[ERROR] Error in posting results ${err.message}`),
        );
      console.log(
        `[INFO] Successfully posted weekly lottery at ${prettyDate()}`,
      );

      return null;
    }

    const userID: string = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    const wins: number = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);
    const renderResult = renderLotteryEmbed(lotteryResult, {
      wins,
      ...user,
    });
    this.client
      .executeWebhook(hookID, token, {
        ...renderResult,
      })
      .catch((err) =>
        console.error(`[ERROR] Error in posting results ${err.message}`),
      );

    //dm winner
    const channel = await this.client.getDMChannel(userID);
    await this.client
      .dm(channel.id, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err) =>
        console.error(`[ERROR] Error sending dm: ${err.message}`),
      );

    // reset weekly lottery
    await this.db.resetWeeklyLottery();
    console.log(`[INFO] Successfully posted weekly lottery at ${prettyDate()}`);
    return null;
  }

  start(context: context): void {
    console.log('[INFO] Started weekly task.');
    super.start(context);
  }
}
