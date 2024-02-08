import { loadItems } from '@assets/items';
import Client from '@structs/Client';
import RedisClient from '@structs/Redis';
import Sentry from '@structs/Sentry';
import type { context } from '@typings';
import { loadConfig, loadDevConfig, setContext } from '@utils';
import { Database } from 'bro-database';
import { IntentsBitField, Partials } from 'discord.js';

// TODO: implement ShardingManager
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
  context.client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildWebhooks,
      IntentsBitField.Flags.GuildEmojisAndStickers,
      IntentsBitField.Flags.DirectMessages
    ],
    partials: [Partials.Message],
    allowedMentions: {
      parse: ['users', 'roles'],
      repliedUser: true
    }
  });

  if (context.config.env === 'dev') {
    context.devConfig = loadDevConfig();
  }

  await Promise.all([
    context.client.login(context.config.keys.discord),
    context.client.loadEvents(context),
    setContext(context)
  ]);
}

main().catch((error) => {
  console.error(error);
  Sentry.captureException(error);
});
