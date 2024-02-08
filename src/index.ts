import { info, loadConfig } from '@utils';
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
})();
