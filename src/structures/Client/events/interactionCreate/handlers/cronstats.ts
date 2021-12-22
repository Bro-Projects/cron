import type { CommandInteraction, EmbedOptions } from 'eris';
import { getUptime, randomColour } from '../../../../../utils';
import { renderGiveaways } from '../../../../../renderers';
import { context } from '../../../../../typings';

export async function cronstats(this: context, slash: CommandInteraction) {
  const activeGiveaways = this.giveaways.size;
  const embeds: EmbedOptions[] = [
    {
      title: 'Stats for cron instance',
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
