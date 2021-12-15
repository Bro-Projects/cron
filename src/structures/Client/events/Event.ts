import type { ClientEvents, Events } from 'eris';
import type { context } from '../../../typings';

export default interface Event {
  packetName: keyof Events | keyof ClientEvents;
  once?: boolean;
  handler(this: context, ...args: any): Promise<void> | void;
}
