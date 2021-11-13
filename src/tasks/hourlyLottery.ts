import type { context } from '../typings';
import { renderHourlyEmbed } from '../renderers';
import { prettyDate, log } from '../utils';
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

    const userID = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    await this.db.updateCooldown(userID, 'hourly');
    const wins = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);
    const renderResult = renderHourlyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    await this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.resetHourly();

    // dm winner
    await this.client
      .sendDM(userID, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted hourly lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started hourly task.`);
    super.start(context);
  }
}
