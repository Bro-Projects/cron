import { context } from '../../../../../typings';
import { CommandInteraction } from 'eris';
import tasks from '../../../../../tasks';
import { loadConfig } from '../../../../../utils';

export async function forcetask(this: context, slash: CommandInteraction) {
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

  const className = (slash.data.options[0] as { value: string }).value;
  try {
    const TaskClass = tasks.find((task) => task.name === className);
    const task = new TaskClass();
    task.task.call(this);
  } catch (error) {
    console.error(error);
  }
  slash.reply({
    embeds: [
      {
        description: `Performed the ${slash.data.options[0].name} task successfully`
      }
    ]
  });
}
