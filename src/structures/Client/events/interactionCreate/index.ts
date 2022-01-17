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
    const handler = handlers[interaction?.data?.name];
    if (!handler) {
      log('[ERROR] Invalid command name received');
      return null;
    }
    await handler.call(this, interaction);
  }
};
