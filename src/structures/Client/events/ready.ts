import type Event from './Event';
import { log } from '../../../utils';

export const onReady: Event = {
  packetName: 'ready',
  handler() {
    log(`${this.client.user.tag} (cron) is online!`);
    const guildIDs = [
      '773897905496916021',
      '705554044076163113',
      '865095931047968778'
    ];
    for (const guildID of guildIDs) {
      this.client.createGuildCommand(guildID, {
        name: 'evaluate',
        description: 'yes',
        options: [
          {
            name: 'stuff',
            type: 3,
            description: 'What you want to evaluate.',
            required: true
          }
        ]
      });

      this.client.createGuildCommand(guildID, {
        name: 'cronstats',
        description: 'View stats for cron instance & automated tasks'
      });

      this.client.createGuildCommand(guildID, {
        name: 'resetcstats',
        description: 'Reset currencystats data for Bro'
      });
      log(`Reloaded / commands in ${this.client.guilds.get(guildID).name}`);
    }
  }
};
