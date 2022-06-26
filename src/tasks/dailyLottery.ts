import type { context } from '@typings';
import { renderDailyEmbed } from '@renderers';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class DailyTask extends GenericTask {
  interval = '30 12 * * *';

  async task(this: context): Promise<null> {
    const lotteryHooks = this.config.webhooks.lottery;

    // get results
    const lotteryResult = await this.db.lotteries.getStats('daily');

    const { winnerID, amountWon } = lotteryResult;
    await this.db.addLotteryWin(winnerID, amountWon);
    await this.db.users.updateCooldown(winnerID, 'daily');
    const wins = await this.db.users.getLotteryWins(winnerID);
    const user = await this.client.getRESTUser(winnerID);
    const renderResult = renderDailyEmbed(lotteryResult, {
      wins,
      ...user
    });
    await Promise.all(
      lotteryHooks.map((hook) =>
        this.client
          .executeWebhook(hook.hookID, hook.token, {
            ...renderResult
          })
          .catch((err: Error) =>
            log(`[ERROR] Error while posting results: ${err.message}`)
          )
      )
    );

    // reset lottery
    await this.db.lotteries.reset('daily');

    // dm winner
    const dm = await this.client
      .getDMChannel(winnerID);
      
    await dm.createMessage(renderResult)
      .catch((err: Error) => log(`[ERROR] Error sending DM: ${err.message}`));

    log(`[INFO] Successfully posted daily lottery.`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started daily task.`);
    super.start(context);
  }
}
