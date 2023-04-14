import { CommandInteraction } from 'discord.js';
import { context } from '@typings';
import { getUptime, randomColour } from '@utils';

export async function cronstats(this: context, slash: CommandInteraction) {
  return slash.reply({
    embeds: [
      {
        title: 'Stats for cron instance',
        description: `Uptime: ${getUptime()}`,
        color: randomColour()
      }
    ]
  });
}
