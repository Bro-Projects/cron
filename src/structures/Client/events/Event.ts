import type { ClientEvents } from 'discord.js';
import type { context } from '@typings';

export default interface Event {
  packetName: keyof ClientEvents;
  once?: boolean;
  handler(this: context, ...args: any): Promise<void> | void;
}
