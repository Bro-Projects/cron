import { renderDailyEmbed } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class DailyTask extends GenericTask {
  interval = '30 12 * * *';
  name = 'daily';

  async task(this: context): Promise<void> {
    if (this.config.modOnly) return null;
    const lotteryHooks = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('daily');

    // minus fees
    const { winnerID, amountWon, fee } = lotteryResult;
    const amountWonWithoutFees = amountWon - fee;

    // database stuff
    await this.db.addLotteryWin(winnerID, amountWonWithoutFees);
    await this.db.users.updateCooldown(winnerID, 'daily');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.users.fetch(winnerID, { force: true });

    // render results
    const renderResult = renderDailyEmbed(lotteryResult, {
      wins,
      ...user
    });

    await Promise.all(
      lotteryHooks.map(({ hookID, token }) =>
        this.client
          .sendWebhookMessage(hookID, token, renderResult)
          .catch((err: Error) =>
            log(`[ERROR] Error while posting results: ${err.message}`)
          )
      )
    );

    // reset lottery
    await this.db.lotteries.reset('daily');

    // dm winner
    await this.client.dm(winnerID, renderResult);
    log(`[INFO] Successfully posted daily lottery.`);

    // auto lottery
    const dailyUserIDs = await this.db.users.getValidAutoLotteryUserIDs(
      'daily'
    );
    if (!dailyUserIDs.length) {
      return log('[ERROR] No valid auto lottery users found.');
    }

    await this.db.enterAutoLotteryUsers(dailyUserIDs, 'daily', 500000);
    return log(
      `[INFO] Daily auto-lottery for ${dailyUserIDs.length} users have been updated`
    );
  }

  start(context: context): void {
    log(`[INFO] Started daily task.`);
    super.start(context);
  }
}
