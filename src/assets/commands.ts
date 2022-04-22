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
  },
  middleman: {
    name: 'middleman',
    description:
      'Request a middleman for a certain trade, follow the options on this slash command if you need help',
    options: [
      {
        required: true,
        name: 'name',
        type: 6,
        description: "The user you'd like to make a trade with"
      },
      {
        required: true,
        name: 'your_offer',
        type: 3,
        description: 'Your offer for this trade'
      },
      {
        required: true,
        name: 'their_offer',
        type: 3,
        description: 'Their offer for this trade'
      }
    ]
  },
  donate: {
    name: 'donate',
    description: 'donate',
    options: [
      {
        type: 3,
        name: 'bot',
        description: 'bot',
        required: true,
        choices: [
          {
            name: 'Dank Memer',
            value: 'dank'
          },
          {
            name: 'Bro',
            value: 'bro'
          }
        ]
      },
      {
        name: 'time',
        description: 'time',
        type: 3,
        required: true
      },
      {
        name: 'requirement',
        description: 'req',
        type: 3,
        required: true
      },
      {
        name: 'amount',
        description: 'amt',
        type: 3,
        required: true
      },
      {
        name: 'winners',
        description: 'winners',
        type: 4,
        required: true
      },
      {
        name: 'message',
        type: 3,
        description: 3,
        required: false
      }
    ]
  }
} as Record<string, ApplicationCommandStructure>;
