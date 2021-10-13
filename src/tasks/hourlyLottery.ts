import type { context } from '../typings';
import { renderHourlyEmbed } from '../renderers';
import { prettyDate } from '../utils';
import GenericTask from './genericTask';

export default class HourlyTask extends GenericTask {
  interval = '0 * * * *';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.getHourlyStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderHourlyEmbed(lotteryResult);
      this.client
        .executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err) =>
          console.error(`[ERROR] Error while posting results: ${err.message}`),
        );
      console.log(
        `[INFO] Successfully posted hourly lottery at ${prettyDate()}`,
      );
      return null;
    }

    const userID = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    await this.db.updateCooldown(userID, 'hourly');
    const wins = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);
    const renderResult = renderHourlyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.resetHourly();

    // dm winner
    const channel = await this.client.getDMChannel(userID);
    await this.client
      .dm(channel.id, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err) => console.log(`[ERROR] Error sending DM: ${err.message}`));

    console.log(`[INFO] Successfully posted hourly lottery at ${prettyDate()}`);
    return null;
  }

  start(context: context): void {
    console.log(`[INFO] Started hourly task at ${prettyDate()}`);
    super.start(context);
  }
}
