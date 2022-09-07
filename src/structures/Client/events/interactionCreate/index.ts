import type Event from '../Event';
import { CommandInteraction } from 'eris';
import * as handlers from './handlers';

export const onInteraction: Event = {
  packetName: 'interactionCreate',
  async handler(interaction: CommandInteraction) {
    if (!(interaction instanceof CommandInteraction)) {
      return null;
    }
    const handler = handlers[interaction?.data?.name];
    if (!handler) {
      return null;
    }
    await handler.call(this, interaction);
  }
};
