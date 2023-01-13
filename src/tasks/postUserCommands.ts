import type { CommandCounts } from 'bro-database';
import type { context } from '@typings';
import { renderTopCommandUsage } from '@renderers';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class PostUserCommands extends GenericTask {
  interval = '0 */8 * * *';

  async task(this: context): Promise<void> {
    const { hookID, token } = this.config.webhooks.userCmdUsage;
    const commandKeys = await this.redis.keys('commands:*');
    const commandUsages = await Promise.all(
      commandKeys.map(async (key) => {
        return {
          [key]: await this.redis.hgetall(key)
        };
      })
    );
    const commandCounts: CommandCounts = {};

    commandUsages.forEach((usage) => {
      for (const command in usage) {
        // Remove the prefix "command:" from the command string
        const cleanedCommand = command.replace('command:', '');
        for (const userID in usage[command]) {
          if (!commandCounts[userID]) {
            commandCounts[userID] = { total: 0 };
          }
          commandCounts[userID][cleanedCommand] = Number(
            usage[command][userID]
          );
          commandCounts[userID].total += Number(usage[command][userID]);
        }
      }
    });

    if (!commandUsages.length || !Object.keys(commandCounts).length)
      return null;

    // add data to MongoDB for further analysis if needed
    await this.db.snapshots.addSnapshot('topUserCommands-8h', commandCounts);

    // delete data from Redis for the next 8h cycle
    try {
      (await Promise.all(commandKeys)).forEach(async (cmd) =>
        this.redis.del(cmd)
      );
    } catch (err) {
      log(`Error when deleting Redis keys:\n${err.stack}`);
    }

    await this.client.executeWebhook(
      hookID,
      token,
      renderTopCommandUsage(commandCounts, false)
    );
    log('[INFO] Successfully calculated user cmd usage in 8h and posted.');
  }

  async start(context: context): Promise<void> {
    log('[INFO] Started user-cmd usage calculation task.');
    super.start(context);
  }
}
