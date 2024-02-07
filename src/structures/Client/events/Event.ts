import type { context } from '@typings';
import type { ClientEvents } from 'discord.js';

export default interface Event {
  packetName: keyof ClientEvents;
  once?: boolean;
  handler(this: context, ...args: any): Promise<void> | void;
}
