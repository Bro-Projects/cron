import type { ApplicationCommandStructure } from 'eris';

export default {
  cronstats: {
    name: 'cronstats',
    type: 1,
    description: 'View stats for cron instance'
  },
  resetcstats: {
    name: 'resetcstats',
    type: 1,
    description: 'Reset currencystats data for Bro'
  },
  forcetask: {
    name: 'forcetask',
    type: 1,
    description: 'Force do any task',
    options: [
      {
        type: 3,
        name: 'taskname',
        required: true,
        description: 'Task name',
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
} as Record<string, ApplicationCommandStructure>;
