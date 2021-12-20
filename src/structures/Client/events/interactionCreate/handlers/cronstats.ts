import type { EmbedOptions } from 'eris';
import type Handler from './Handler';
import { getUptime, randomColour } from '../../../../../utils';
import { renderGiveaways } from '../../../../../renderers';

export const cronstats: Handler = async (ctx, slash) => {
  await slash.defer();
  const activeGiveaways = ctx.giveaways.size;
  const embeds: EmbedOptions[] = [
    {
      title: `Stats for cron instance`,
      description: `Uptime: ${getUptime()}\nGiveaways Active: **${activeGiveaways}**`,
      color: randomColour(),
    },
  ];

  if (activeGiveaways >= 1) {
    const giveaways = [...ctx.giveaways.values()];
    embeds[1] = renderGiveaways(giveaways);
  }

  return slash.editOriginal({ embeds });
};
