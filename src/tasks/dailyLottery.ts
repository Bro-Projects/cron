import type { context } from '../typings';
import { renderDailyEmbed } from '../renderers';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class DailyTask extends GenericTask {
  interval = '30 12 * * *';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('daily');

    // render results
    if (!lotteryResult) {
      const renderResult = renderDailyEmbed(lotteryResult);
      this.client
        ._executeWebhook(hookID, token, {
          ...renderResult,
        })
        .catch((err: Error) =>
          log(`[ERROR] Error while posting results: ${err.message}`),
        );
      log(`[INFO] Successfully posted daily lottery (no one entered).`);
      return null;
    }

    const { winnerID, amountWon } = lotteryResult;
    await this.db.users.addLotteryWin(winnerID, amountWon);
    await this.db.users.updateCooldown(winnerID, 'daily');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client._getRESTUser(winnerID);
    const renderResult = renderDailyEmbed(lotteryResult, {
      wins,
      ...user,
    });
    this.client._executeWebhook(hookID, token, {
      ...renderResult,
    });

    // reset lottery
    await this.db.lotteries.reset('daily');

    // dm winner
    await this.client
      .sendDM(winnerID, {
        content: '',
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
