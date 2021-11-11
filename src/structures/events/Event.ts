import { Events } from 'eris';
import type Client from '../Client';

export default interface Event {
  packetName: keyof Events;
  once?: boolean;
  handler(this: Client, ...args: any): Promise<void> | void;
}
