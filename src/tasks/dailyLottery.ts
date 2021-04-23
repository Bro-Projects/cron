import { renderDailyEmbed } from '../renderers';
import { context } from '../typings';
import { prettyDate } from '../utils';
import GenericTask from './genericTask';

export default class DailyTask extends GenericTask {
  interval = '30 12 * * *';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.getDailyStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderDailyEmbed(lotteryResult);
      this.client
        .executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err) =>
          console.error(`[ERROR] Error while posting results: ${err.message}`),
        );
      console.log(`[INFO] Successfully posted daily lottery at ${prettyDate()} (no one entered)`);
      return null;
    }

    const userID = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    await this.db.updateCooldown(userID, 'daily');
    const wins = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);
    const renderResult = renderDailyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.resetDaily();
    
    // dm winner
    const channel = await this.client.getDMChannel(userID);
    await this.client
      .dm(channel.id, {
        content: '',
        embed: renderResult.embeds[0],
      }).catch((err) => 
        console.log(`[ERROR] Error sending DM: ${err.message}`)
      );

    console.log(`[INFO] Successfully posted daily lottery at ${prettyDate()}`);
    return null;
  }

  start(context: context): void {
    console.log(`[INFO] Started daily task at ${prettyDate()}`);
    super.start(context);
  }
}
