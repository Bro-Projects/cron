import type Event from '../Event';
import { CommandInteraction } from 'eris';
import * as handlers from './handlers';
import { log } from '../../../../utils';

export const onInteraction: Event = {
  packetName: 'interactionCreate',
  async handler(interaction: CommandInteraction) {
    if (!(interaction instanceof CommandInteraction)) {
      return null;
    }
    for (const [name, handler] of Object.entries(handlers)) {
      if (interaction.data.name !== name) {
        log('[ERROR] Invalid command name received');
        return null;
      }
      await handler.call(this, interaction);
    }
  },
};
