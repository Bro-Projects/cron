import type { Events } from 'eris';
import type { context } from '../../../typings';

export default interface Event {
  packetName: keyof Events;
  once?: boolean;
  handler(this: context, ...args: any): Promise<void> | void;
}
