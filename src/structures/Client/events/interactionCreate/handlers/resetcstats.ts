import { context } from '../../../../../typings';
import { CommandInteraction } from 'eris';
import cstatsTask from '../../../../../tasks/currencyStats'

export async function resetcstats(this: context, slash: CommandInteraction) {
  const cstats = new cstatsTask();
  cstats.task.call(this);
  slash.reply({ content: 'done', ephemeral: true });
}
