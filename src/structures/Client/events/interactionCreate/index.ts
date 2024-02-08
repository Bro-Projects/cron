import { info } from '@utils';
import type { Interaction } from 'discord.js';
import Event from '../Event';
import * as handlers from './handlers';

export const onInteraction: Event = {
  packetName: 'interactionCreate',
  async handler(interaction: Interaction) {
    try {
      if (!interaction?.isCommand()) {
        return null;
      }
      const handler = handlers[interaction.commandName];
      if (!handler) {
        return null;
      }
      await handler.call(this, interaction);
    } catch (err) {
      info(err.message);
    }
  }
};
