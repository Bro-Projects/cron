import type { context } from '@typings';
import { CommandInteraction, Constants } from 'eris';
import tasks from '@tasks';
import { loadConfig } from '@utils';

export async function forcetask(this: context, slash: CommandInteraction) {
  const config = loadConfig();

  if (!config.owners.includes(slash.member.id)) {
    return slash.createMessage({
      embeds: [
        {
          description: "You're not an owner."
        }
      ],
      flags: Constants.MessageFlags.EPHEMERAL
    });
  }

  const className = (slash.data.options[0] as { value: string }).value;
  try {
    const TaskClass = tasks.find((task) => task.name === className);
    const task = new TaskClass();
    task.task.call(this);
  } catch (error) {
    console.error(error);
  }
  await slash.createMessage({
    embeds: [
      {
        description: `Performed the **${className}** task successfully.`
      }
    ]
  });
}
