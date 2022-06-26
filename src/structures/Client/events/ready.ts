import type Event from './Event';
import { log } from '@utils';
import COMMANDS from '@assets/commands';

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
        this.client.bulkEditGuildCommands(guildID, commands)
      )
    );

    promises.forEach((appCmdArr) => {
      log(
        `Reloaded / commands in ${
          this.client.guilds.get(appCmdArr[0].guild_id).name
        }`
      );
    });
  }
};
