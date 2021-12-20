import type Event from '../Event';
import type { CommandInteraction } from 'eris';
import * as handlers from './handlers';

export const onInteraction: Event = {
  packetName: 'interactionCreate',
  async handler(interaction: CommandInteraction) {
    for (const [name, handler] of Object.entries(handlers)) {
      if (interaction.data.name !== name) {
        console.log('invalid command name received');
        return null;
      }
      await handler.call(this, interaction);
    }
  },
};
