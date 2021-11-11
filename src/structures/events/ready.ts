import type Event from './Event';
import { log } from '../../utils';

export const onReady: Event = {
  packetName: 'ready',
  handler() {
    log(`${this.user.tag} (cron) is online!`);
  },
};
