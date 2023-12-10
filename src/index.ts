import type { context } from '@typings';
import Client from '@structs/Client';
import RedisClient from '@structs/Redis';
import { Database } from 'bro-database';
import { loadConfig, loadDevConfig } from '@utils';
import tasks from '@tasks';
import { loadItems } from '@assets/items';
import Sentry from '@structs/Sentry';

async function main() {
  const context: context = {
    db: null,
    config: loadConfig(),
    client: null,
    reminders: new Map(),
    redis: null
  };

  await loadItems();

  context.db = await Database.create(context.config.keys.mongoURI);
  context.redis = null;
  try {
    context.redis = new RedisClient(context.config.keys.redis);
  } catch (err) {
    console.error('Failed to initialize Redis client:', err);
  }
  context.client = new Client(`Bot ${context.config.keys.discord}`, {
    intents: ['guilds', 'guildWebhooks', 'guildEmojis', 'directMessages'],
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

  await Promise.all([
    context.client.connect(),
    context.client.loadEvents(context)
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

main().catch(error => {
  console.error(error);
  Sentry.captureException(error);
});
