import { CommandInteraction } from 'discord.js';
import { context } from '@typings';
import tasks from '@tasks';
import { loadConfig } from '@utils';

export async function forcetask(this: context, slash: CommandInteraction) {
  const config = loadConfig();

  if (!config.owners.includes(slash.user.id)) {
    return slash.reply({
      embeds: [
        {
          description: "You're not an owner."
        }
      ],
      ephemeral: true
    });
  }

  const className = slash.options.get('taskname').value;
  try {
    const TaskClass = tasks.find((task) => task.name === className);
    const task = new TaskClass();
    task.task.call(this);
  } catch (error) {
    console.error(error);
  }
  await slash.reply({
    embeds: [
      {
        description: `Performed the **${className}** task successfully.`
      }
    ]
  });
}
