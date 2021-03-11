import Client from './structures/Client';
import Database from './structures/Database';

import { loadConfig } from './utils';
import { r } from 'rethinkdb-ts';
import { context } from './typings';

import tasks from './tasks';

async function main() {
  const context: context = {
    db: new Database(),
    config: loadConfig(),
    client: null,
  };
  context.client = new Client(context.config.keys.discord);
  await context.db.connect(r);

  for (const Task of tasks) {
    const createdTask = new Task();
    createdTask.start(context);
  }
}

main();
