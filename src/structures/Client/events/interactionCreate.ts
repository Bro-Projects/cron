import type { CommandInteraction, EmbedOptions } from 'eris';
import type Event from './Event';
import { getUptime, randomColour } from '../../../utils';
import { renderGiveaways } from '../../../renderers';

export const onInteraction: Event = {
  packetName: 'interactionCreate',
  async handler(slash: CommandInteraction) {
    if (slash.data.name === 'cronstats') {
      const activeGiveaways = this.giveaways.size;
      const embeds: EmbedOptions[] = [
        {
          title: `Stats for cron instance`,
          description: `Uptime: ${getUptime()}\nGiveaways Active: **${activeGiveaways}**`,
          color: randomColour(),
        },
      ];

      if (activeGiveaways >= 1) {
        const giveaways = [...this.giveaways.values()];
        embeds[1] = renderGiveaways(giveaways);
      }

      return slash.reply({ embeds });
    }
  },
};
