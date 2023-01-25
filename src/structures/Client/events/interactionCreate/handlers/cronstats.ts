import type { CommandInteraction } from 'eris';
import type { context } from '@typings';
import { getUptime, randomColour } from '@utils';

export async function cronstats(this: context, slash: CommandInteraction) {
  return slash.createMessage({
    embeds: [
      {
        title: 'Stats for cron instance',
        description: `Uptime: ${getUptime()}`,
        color: randomColour()
      }
    ]
  });
}
