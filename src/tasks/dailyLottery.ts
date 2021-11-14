import type { context } from '../typings';
import { renderDailyEmbed } from '../renderers';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class DailyTask extends GenericTask {
  interval = '0 * * * *'; // revert to 30 12 * * *

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.getDailyStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderDailyEmbed(lotteryResult);
      await this.client
        .executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err: Error) =>
          log(`[ERROR] Error while posting results: ${err.message}`),
        );
      log(`[INFO] Successfully posted daily lottery (no one entered).`);
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
    await this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.resetDaily();

    // dm winner
    await this.client
      .sendDM(userID, {
        embed: renderResult.embeds[0],
      })
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted daily lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started daily task.`);
    super.start(context);
  }
}
