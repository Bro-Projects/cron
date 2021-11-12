import type Event from './Event';
import { log } from '../../../utils';

export const onReady: Event = {
  packetName: 'ready',
  handler() {
    log(`${this.client.user.tag} (cron) is online!`);
  },
};
