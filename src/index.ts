import type { context } from '@typings';

import Redis from 'ioredis';
import Client from '@structs/Client';
import Database from '@structs/Database';
import { loadConfig, loadDevConfig } from '@utils';
import tasks from '@tasks';

async function main() {
  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null,
    giveaways: new Map(),
    reminders: new Map(),
    redis: new Redis()
  };
  context.client = new Client(`Bot ${context.config.keys.discord}`, {
    intents: [
      'guilds',
      'guildMessages',
      'guildWebhooks',
      'guildEmojis',
      'directMessages'
    ],
    allowedMentions: {
      users: true
    },
    restMode: true,
    disableEvents: {
      MESSAGE_CREATE: true
    },
    maxShards: 'auto',
    maxReconnectAttempts: 25,
    maxResumeAttempts: 50,
    messageLimit: 1
  });

  if (context.config.env === 'dev') {
    context.devConfig = loadDevConfig();
  }

  Promise.all([
    context.client.connect(),
    context.client.loadEvents(context),
    await context.db.bootstrap(context.config.keys.mongoURI)
  ]);

  for (const Task of tasks) {
    if (context.config.env !== 'dev') {
      const createdTask = new Task();
      createdTask.start(context);
      continue;
    }

    if (!context.devConfig.tasks.includes(Task.name)) {
      continue;
    }

    const createdTask = new Task();
    createdTask.setInterval('* * * * *');
    createdTask.start(context);
  }
}

main();
