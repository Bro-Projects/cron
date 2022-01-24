import { context } from '../../../../../typings';
import { CommandInteraction } from 'eris';
import cstatsTask from '../../../../../tasks/currencyStats';
import { loadConfig } from '../../../../../utils';

export async function resetcstats(this: context, slash: CommandInteraction) {
  const config = loadConfig();

  if (!config.owners.includes(slash.member.id)) {
    return slash.reply({
      embeds: [
        {
          description: "You're not an owner."
        }
      ],
      ephemeral: true
    });
  }
  const cstats = new cstatsTask();
  cstats.task.call(this);
  slash.reply({ content: 'done', ephemeral: true });
}
