import Client from './structures/Client';
import { createTask, loadConfig, Config } from './utils';
import { renderLotteryEmbed } from './renderers';
import Database from './structures/Database';
import { User } from 'eris';
import { r } from 'rethinkdb-ts';

type genericTask = (this: context) => void;

interface context {
  config: Config;
  db: Database;
  client: Client;
}

async function main() {
  const task: genericTask = async function () {
    console.log('Task started');
    const { hookID, token } = this.config.webhooks.lottery;
    // get results
    const lotteryResult = await this.db.getLotteryStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderLotteryEmbed(lotteryResult);
      this.client.executeWebhook(hookID, token, {
        ...renderResult
      });
      return null;
    }

    const wins = await this.db.getLotteryWins(lotteryResult.winnerID);
    const { username, discriminator } = (await this.client.getRESTUser(
      lotteryResult.winnerID
    )) as Partial<User>;
    const renderResult = renderLotteryEmbed(lotteryResult, {
      wins,
      username,
      discriminator
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult
    });

    //dm winner
    const channel = await this.client.getDMChannel(lotteryResult.winnerID);
    try {
      await this.client.dm(
        channel.id,
        renderResult.content,
        renderResult.embeds[0]
      );
    } catch (err) {
      console.log(`Couldn't dm user! Error: ${err.message}`);
    }

    // reset lottery
    await this.db.addLotteryWin(lotteryResult.winnerID, lotteryResult.amountWon);
    await this.db.resetLottery();
    return null;
  };

  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null
  };
  context.client = new Client(context.config.keys.discord);

  await context.db.connect(r);
  // console.log(context);
  createTask(task.bind(context)).start();
}

main();
