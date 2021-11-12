import type { EmbedOptions, Message } from 'eris';
import type Event from './Event';
import { getUptime } from '../../utils';
import { renderGiveaways } from '../../renderers';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {
    if (msg.content !== 'cron stats') {
      return null;
    }

    const embeds: EmbedOptions[] = [
      {
        title: `Stats for cron instance`,
        description: `Uptime: ${getUptime()}\nGiveaways Active: **${
          this.giveaways.size
        }**`,
      },
    ];

    if (this.giveaways.size >= 1) {
      const giveaways = [...this.giveaways.values()];
      embeds[1] = renderGiveaways(giveaways);
    }

    await msg.reply({ embeds });
  },
};
