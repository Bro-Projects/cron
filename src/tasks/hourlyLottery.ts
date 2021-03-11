import { renderLotteryEmbed, renderLotteryReminder } from '../renderers';
import { context } from '../typings';
import { prettyDate } from '../utils';
import GenericTask from './genericTask';

export default class HourlyTask extends GenericTask {
  interval = '0 * * * *';

  async task(this: context): Promise<null> {
    const { hookID, token } = this.config.webhooks.lottery;
    // get results
    const lotteryResult = await this.db.getLotteryStats();

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
      console.log(`[INFO] Successfully posted hourly lottery at ${prettyDate()}`);

      return null;
    }

    const userID = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    const wins = await this.db.getLotteryWins(userID);
    const user = await this.client.getRESTUser(userID);
    const renderResult = renderLotteryEmbed(lotteryResult, {
      wins,
      ...user,
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult,
    });

    // lottery reminders
    const users = (await this.db.getLotteryUsers()).filter(
      (id) => id !== userID,
    );
    await Promise.all(
      users.map(async (user) => {
        const noDMs = await this.db.getSettings(user);
        if (noDMs) {
          return null;
        }
        const channel = await this.client.getDMChannel(user);
        await this.client.dm(channel.id, { ...renderLotteryReminder() });
      }),
    ).catch((err) =>
      console.log(`[ERROR] Error in sending reminder: ${err.message}`),
    );

    //dm winner
    const channel = await this.client.getDMChannel(userID);
    await this.client
      .dm(channel.id, {
        content: '',
        embed: renderResult.embeds[0],
      })
      .catch((err) => console.log(`[ERROR] Error sending dm: ${err.message}`));

    // reset lottery
    await this.db.resetLottery();
    console.log(`[INFO] Successfully posted hourly lottery at ${prettyDate()}`);
    return null;
  }

  start(context: context): void {
    console.log('[INFO] Started hourly task.');
    super.start(context);
  }
}
