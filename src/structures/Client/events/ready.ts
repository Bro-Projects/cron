import COMMANDS from '@assets/commands';
import { log } from '@utils';
import type Event from './Event';

export const onReady: Event = {
  packetName: 'ready',

  async handler() {
    log(`${this.client.user.username} (cron) is online!`);

    let guildIDs = [
      '773897905496916021',
      '705554044076163113',
      '865095931047968778'
    ];

    let commands = Object.values(COMMANDS);

    if (this.config.env === 'dev') {
      guildIDs = this.devConfig.servers;
      commands = commands.filter((cmd) =>
        this.devConfig.commands.includes(cmd.name)
      );
    }

    const promises = await Promise.all(
      guildIDs.map((guildID) =>
        this.client.application.commands
          .set(commands, guildID)
          .then(() => [guildID])
          .catch((err) => {
            console.log(
              `Failed to edit commands in guild: ${guildID}\nError: ${err.message}`
            );
            return [guildID, err];
          })
      )
    );

    promises.forEach((result) => {
      const [guildID, err] = result;
      if (err) {
        console.log(
          `Failed to reload commands in ${
            this.client.guilds.cache.get(guildID)?.name ?? 'unknown guild'
          }\nError: ${err.message}`
        );
      } else {
        console.log(
          `Reloaded / commands in ${
            this.client.guilds.cache.get(guildID)?.name ?? 'unknown guild'
          }`
        );
      }
    });
  }
};
