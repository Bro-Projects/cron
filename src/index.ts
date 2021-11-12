import type { context } from './typings';
import Client from './structures/Client/Client';
import Database from './structures/Database';
import { loadConfig } from './utils';
import { r } from 'rethinkdb-ts';
import tasks from './tasks';

async function main() {
  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null,
    giveaways: new Map(),
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
  });

  await Promise.all([
    context.client.connect(),
    context.client.loadEvents(context),
    await context.db.bootstrap(context.config.keys.mongoURI),
  ]);

  for (const Task of tasks) {
    const createdTask = new Task();
    createdTask.start(context);
  }
}

main();
