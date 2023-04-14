import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ApplicationCommandType
} from 'discord.js';

const commands: ApplicationCommandData[] = [
  {
    name: 'cronstats',
    description: 'View stats for cron instance',
    type: ApplicationCommandType.ChatInput
  },
  {
    name: 'resetcstats',
    description: 'Reset currencystats data for Bro',
    type: ApplicationCommandType.ChatInput
  },
  {
    name: 'forcetask',
    description: 'Force do any task',
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'taskname',
        description: 'Task name',
        required: true,
        choices: [
          {
            name: 'Currency Stats',
            value: 'CurrencyStatsTask'
          },
          {
            name: 'Daily Lottery',
            value: 'DailyTask'
          },
          {
            name: 'Hourly lottery',
            value: 'HourlyTask'
          },
          {
            name: 'Weekly Lottery',
            value: 'WeeklyTask'
          },
          {
            name: 'Vote Reminders',
            value: 'RemindersTask'
          },
          {
            name: 'Role Removal',
            value: 'RoleRemovalTask'
          },
          {
            name: '1h Command Usage',
            value: 'PostCmdUsageTask'
          },
          {
            name: '24h Command Usage',
            value: 'Post24hCmdUsageTask'
          },
          {
            name: '8h User Commands',
            value: 'PostUserCommands'
          }
        ]
      }
    ]
  }
];

export default commands;
