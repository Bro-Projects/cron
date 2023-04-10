const { MultiSelect, Confirm } = require('enquirer');
const { writeFileSync } = require('fs');
const { join, resolve } = require('path');

function extract(arr, vals) {
  return arr.filter((e) => vals.includes(e.name)).map((e) => e.value);
}

function vals(arr) {
  return arr.map((e) => e.value);
}

async function askQuestions() {
  const reses = {
    commands: [
      { value: 'cronstats', name: 'Cron Stats' },
      { value: 'forcetask', name: 'Force Task' },
      { value: 'resetcstats', name: 'Reset cstats' }
    ],
    servers: [
      {
        name: 'Bro Testing',
        value: '865095931047968778'
      },
      { name: 'Bro Community', value: '773897905496916021' },
      { name: 'Stuff', value: '705554044076163113' }
    ],
    tasks: [
      { name: 'Currency Stats', value: 'CurrencyStatsTask' },
      { name: 'Role Removal', value: 'RoleRemovalTask' },
      { name: 'Vote Reminder', value: 'RemindersTask' },
      { name: 'Hourly Lottery', value: 'HourlyTask' },
      { name: 'Daily Lottery', value: 'DailyTask' },
      { name: 'Weekly Lottery', value: 'WeeklyTask' },
      { name: 'Post Stats', value: 'PostStatsTask' },
      { name: 'Post Command Usage', value: 'PostCmdUsageTask' },
      { name: 'Post User Command Usage', value: 'PostUserCommands' }
    ]
  };

  const wantAllSlash = await new Confirm({
    name: 'wantslash',
    message: 'Do you want all slash commands?'
  }).run();

  if (!wantAllSlash) {
    const commands = await new MultiSelect({
      name: 'cmdNames',
      message: 'Select what commands you want:',
      choices: reses.commands,
      result(names) {
        return extract(reses.commands, names);
      }
    }).run();

    reses.commands = commands;
  } else {
    reses.commands = vals(reses.commands);
  }

  if (reses.commands.length > 0) {
    const wantAllServers = await new Confirm({
      name: 'wantservers',
      message: 'Do you want all servers to register commands?'
    }).run();

    if (!wantAllServers) {
      const servers = await new MultiSelect({
        name: 'serverNames',
        message: 'Select what servers you want:',
        choices: reses.servers,
        result(names) {
          return extract(reses.servers, names);
        }
      }).run();

      reses.servers = servers;
    } else {
      reses.servers = vals(reses.servers);
    }
  } else {
    reses.servers = [];
  }

  const wantAllTasks = await new Confirm({
    name: 'wantTasks',
    message: 'Do you want all task to happen?'
  }).run();

  if (!wantAllTasks) {
    const tasks = await new MultiSelect({
      name: 'cmdTasks',
      message: 'Select what tasks you want:',
      choices: reses.tasks,
      result(names) {
        return extract(reses.tasks, names);
      }
    }).run();

    reses.tasks = tasks;
  } else {
    reses.tasks = vals(reses.tasks);
  }

  return reses;
}

async function main() {
  const answers = await askQuestions();
  writeFileSync(
    join(resolve('.'), 'config.dev.json'),
    JSON.stringify(answers, null, 2)
  );

  console.log('Successfully wrote to config.dev.json');
}

main();
