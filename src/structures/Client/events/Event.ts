import type { ClientEvents, EventListeners } from 'eris';
import type { context } from '@typings';

export default interface Event {
  packetName: keyof EventListeners | keyof ClientEvents;
  once?: boolean;
  handler(this: context, ...args: any): Promise<void> | void;
}
