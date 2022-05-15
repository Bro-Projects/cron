import { ApplicationCommandStructure } from 'eris';

export default {
  evaluate: {
    name: 'evaluate',
    description: 'yes',
    options: [
      {
        name: 'stuff',
        type: 3,
        description: 'What you want to evaluate.',
        required: true
      }
    ]
  },
  cronstats: {
    name: 'cronstats',
    description: 'View stats for cron instance & automated tasks'
  },
  resetcstats: {
    name: 'resetcstats',
    description: 'Reset currencystats data for Bro'
  },
  forcetask: {
    name: 'forcetask',
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
            name: 'Giveaways',
            value: 'Giveaways'
          },
          {
            name: 'Vote Reminders',
            value: 'RemindersTask'
          },
          {
            name: 'Role Removal',
            value: 'RoleRemovalTask'
          }
        ]
      }
    ]
  }
} as Record<string, ApplicationCommandStructure>;
