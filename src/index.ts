import Client from './structures/Client';
import { createTask, loadConfig, Config, createWeeklyTask } from './utils';
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
  
    const userID: string = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    const wins: number = await this.db.getLotteryWins(userID);
    const { username, discriminator } = (await this.client.getRESTUser(userID)) as Partial<User>;
    const renderResult = renderLotteryEmbed(lotteryResult, {
      wins,
      username,
      discriminator
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult
    });
    
    // lottery reminders
    const users: string[] = await this.db.getLotteryUsers();
    await Promise.all(users.map(async (user) => {
      const dmsDisabled: boolean = await this.db.getSettings(user);
      if (!dmsDisabled) {
        const channel = await this.client.getDMChannel(user);
        try {
          await this.client.dm(
            channel.id,
            null,
            {
              title: 'Lottery was just drawn',
              description: `You can join the new lottery now or see the winner of the last lottery here: <#816669934218117160>\n\nRun \`bro toggledms\` if you don't want to receive these reminders.`,
              timestamp: new Date(),
            }
          );
        } catch (err) {
          console.log(`Error sending reminder: ${err.message}`);
        }
      }
    }));

    //dm winner
    const channel = await this.client.getDMChannel(userID);
    try {
      await this.client.dm(
        channel.id,
        renderResult.content,
        renderResult.embeds[0]
      );
    } catch (err) {
      console.log(`Error sending dm: ${err.message}`);
    }

    // reset lottery
    await this.db.resetLottery();
    return null;
  };

  const weeklyTask: genericTask = async function () {
    console.log('Weekly task started');
    const { hookID, token } = this.config.webhooks.lottery;
    // get results
    const lotteryResult = await this.db.getWeeklyLotteryStats();

    // render results
    if (!lotteryResult) {
      const renderResult = renderLotteryEmbed(lotteryResult);
      this.client.executeWebhook(hookID, token, {
        ...renderResult
      });
      return null;
    }
  
    const userID: string = lotteryResult.winnerID;
    await this.db.addLotteryWin(userID, lotteryResult.amountWon);
    const wins: number = await this.db.getLotteryWins(userID);
    const { username, discriminator } = (await this.client.getRESTUser(userID)) as Partial<User>;
    const renderResult = renderLotteryEmbed(lotteryResult, {
      wins,
      username,
      discriminator
    });
    this.client.executeWebhook(hookID, token, {
      ...renderResult
    });

    //dm winner
    const channel = await this.client.getDMChannel(userID);
    try {
      await this.client.dm(
        channel.id,
        renderResult.content,
        renderResult.embeds[0]
      );
    } catch (err) {
      console.log(`Error sending dm: ${err.message}`);
    }

    // reset weekly lottery
    await this.db.resetWeeklyLottery();
    return null;
  };

  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null
  };
  context.client = new Client(context.config.keys.discord);
  await context.db.connect(r);

  createTask(task.bind(context)).start();
  createWeeklyTask(weeklyTask.bind(context)).start();
}

main();
