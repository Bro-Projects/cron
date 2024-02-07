import { renderWeeklyEmbed } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class WeeklyTask extends GenericTask {
  interval = '30 11 * * Sun';
  name = 'weeklyLottery';

  async task(this: context): Promise<void> {
    if (this.config.modOnly) return null;
    const lotteryHooks = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('weekly');

    // minus fees
    const { winnerID, amountWon, fee } = lotteryResult;
    const amountWithoutFees = amountWon - fee;

    // database stuff
    await this.db.users.addWeeklyWin(winnerID, amountWithoutFees);
    await this.db.users.updateCooldown(winnerID, 'weekly');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.users.fetch(winnerID, { force: true });

    // render results
    const renderResult = renderWeeklyEmbed(lotteryResult, {
      wins,
      ...user
    });

    await Promise.all(
      lotteryHooks.map((hook) =>
        this.client
          .sendWebhookMessage(hook.hookID, hook.token, renderResult)
          .catch((err: Error) =>
            log(`[ERROR] Error while posting results: ${err.message}`)
          )
      )
    );

    // reset weekly lottery
    await this.db.lotteries.reset('weekly');

    //dm winner
    await this.client.dm(winnerID, renderResult);
    log(`[INFO] Successfully posted weekly lottery.`);

    // auto lottery
    const weeklyUserIDs = await this.db.users.getValidAutoLotteryUserIDs(
      'weekly'
    );
    if (!weeklyUserIDs.length) {
      return log('[ERROR] No valid auto lottery users found.');
    }

    await this.db.enterAutoLotteryUsers(weeklyUserIDs, 'weekly', 5000000);
    return log(
      `[INFO] Weekly auto-lottery for ${weeklyUserIDs.length} users have been updated`
    );
  }

  start(context: context): void {
    log(`[INFO] Started weekly task.`);
    super.start(context);
  }
}
