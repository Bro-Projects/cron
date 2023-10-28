import { log } from '@utils';
import type Event from './Event';

export const onError: Event = {
  packetName: 'error',
  handler(error: Error) {
    log(`[ERROR] error event:\n${error.message}`);
  }
};
