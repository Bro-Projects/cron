import tasks from '@tasks';
import { getContext, info, loadConfig } from '@utils';
import { ShardingManager } from 'discord.js';
import { join } from 'node:path';

(async () => {
  info('Init process');

  const config = loadConfig();
  const manager = new ShardingManager(join(__dirname, 'bot.js'), {
    token: config.keys.discord,
    mode: 'process'
  });

  manager.on('shardCreate', (shard) =>
    info(`Launched shard ${shard.id} [CRON]`)
  );

  await manager.spawn();

  const context = getContext();
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
})();
