import type { context } from './typings';
import Client from './structures/Client';
import Database from './structures/Database';
import { loadConfig } from './utils';
import { r } from 'rethinkdb-ts';
import tasks from './tasks';
import Redis from 'ioredis';

async function main() {
  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null,
    giveaways: new Map(),
    redis: new Redis(),
  };
  context.client = new Client(`Bot ${context.config.keys.discord}`, {
    intents: [
      'guilds',
      'guildMessages',
      'guildWebhooks',
      'guildEmojis',
      'directMessages',
    ],
    restMode: true,
    disableEvents: {
      MESSAGE_CREATE: true,
    },
    maxShards: 'auto',
    maxReconnectAttempts: 25,
    maxResumeAttempts: 50,
    messageLimit: 0,
  });

  await Promise.all([context.client.connect(), await context.db.connect(r)]);

  for (const Task of tasks) {
    const createdTask = new Task();
    createdTask.start(context);
  }
}

main();
