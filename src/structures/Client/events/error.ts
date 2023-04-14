import type Event from './Event';
import { log } from '@utils';

export const onError: Event = {
  packetName: 'error',
  handler(error: Error) {
    log(`[ERROR] error event:\n${error.message}`);
  }
};
