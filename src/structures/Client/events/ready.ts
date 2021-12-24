import type Event from './Event';
import { log } from '../../../utils';

export const onReady: Event = {
  packetName: 'ready',
  handler() {
    log(`${this.client.user.tag} (cron) is online!`);
    this.client.createGuildCommand('865095931047968778', {
      name: 'evaluate',
      description: 'yes',
      options: [
        {
          name: 'stuff',
          type: 3,
          description: 'What you want to evaluate.',
          required: true,
        },
      ],
    });

    this.client.createGuildCommand('865095931047968778', {
      name: 'cronstats',
      description: 'show cron stats',
    });

    this.client.createGuildCommand('865095931047968778', {
      name: 'resetcstats',
      description: 'reset currency stats for bro.'
    })
  },
};
