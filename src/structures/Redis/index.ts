import { Item } from '@assets/items';
import type { CloseEvent, Guild, User } from 'discord.js';
import Redis from 'ioredis';

export type redisLocks =
  | 'transfer-lock'
  | 'gift-lock'
  | 'heist'
  | 'fighting'
  | 'robber'
  | 'appealLock'
  | 'cmdProcessing';
export type redisItems =
  | 'steroids'
  | 'umbrella'
  | 'tropicalpunch'
  | 'cocaine'
  | 'leaf'
  | 'flower';
export type redisMisc = 'passive' | 'bro-cstats' | '24hcmdUsage' | 'cmdUsage';

export type redisPubSub = {
  'command-update': {
    user: string;
    guild: string | null;
  };
  'heist-data': {
    result: 'success' | 'failure';
    guild: Guild | null;
    user: User | null;
    bank: number;
    target: User;
    participants: User[];
    aliveUsers?: User[];
    deadUsers?: User[];
  };
  'purchase-data': {
    guild: Guild | null;
    channelName: string;
    user: User | null;
    item: Item;
    initialPocket: number;
    finalPocket: number;
    price: number;
  };
  'sell-data': {
    guild: Guild | null;
    channelName: string;
    user: User | null;
    item: Item;
    initialPocket: number;
    finalPocket: number;
    price: number;
  };
  'share-data': {
    guild: Guild | null;
    channelName: string;
    user: User | null;
    target: User;
    amount: number;
    initialUserPocket: number;
    finalUserPocket: number;
    initialTargetPocket: number;
    finalTargetPocket: number;
  };
  'steal-data': {
    total: number;
    victims: User[];
    summary: string;
    user: User;
  };
  'guild-create': {
    guild: Guild;
    memberCount: number;
    botCount: number;
    channels: Record<string, number>;
    createdAt: Date;
    owner: User;
  };
  'guild-delete': {
    guild: Guild;
    memberCount: number;
    botCount: number;
    channels: Record<string, number>;
    createdAt: Date;
    owner: User | { id: string; tag: string };
  };
  'shard-ready': {
    shard: number;
  };
  'shard-disconnect': {
    shard: number;
    closeEvent: CloseEvent;
  };
  'shard-error': {
    shard: number;
    error: Error;
  };
  'shard-reconnecting': {
    shard: number;
  };
  'shard-resume': {
    replayedEvents: number;
    shard: number;
  };
  stats: {
    shardWiseData: {
      guilds: number;
      largeGuilds: number;
      users: number;
      uptime: number | null;
    }[];
    totalShards: number;
  };
};

export type redisKey = redisLocks | redisItems | redisMisc;

export default class RedisClient {
  public client: Redis;

  constructor(hostAddr: string) {
    this.client = new Redis(hostAddr);
  }

  closeConnection() {
    this.client.quit();
  }

  public get = async (item: redisKey, userID?: string) => {
    if (userID) {
      return this.client.get(`${item}-${userID}`);
    }
    return this.client.get(item);
  };

  public set = async (item: redisKey, data: string) =>
    await this.client.set(item, data);

  public setEx = async (
    item: redisKey,
    userId: string,
    value: string | number | Buffer,
    seconds: number
  ) => await this.client.set(`${item}-${userId}`, value, 'EX', seconds);

  public setTTL = async (
    item: redisKey,
    userId: string,
    value: string | number | Buffer
  ) => await this.client.set(`${item}-${userId}`, value, 'KEEPTTL');

  public ttl = async (item: redisKey, userId: string) =>
    await this.client.ttl(`${item}-${userId}`);

  public del = async (item: redisKey, userID?: string) => {
    if (userID) {
      return this.client.del(`${item}-${userID}`);
    }
    return this.client.del(item);
  };

  public exists = async (item: redisKey, userID?: string) => {
    if (userID) {
      return this.client.exists(`${item}-${userID}`);
    }
    return this.client.exists(item);
  };

  public hgetall = async (query: string) => {
    return this.client.hgetall(query);
  };

  public keys = async (query: string) => {
    return this.client.keys(query);
  };

  async publish<T extends keyof redisPubSub>(item: T, data: redisPubSub[T]) {
    return this.client.publish(item, JSON.stringify(data));
  }

  async setModOnly(cmdMap: { [k: string]: '0' | '1' }) {
    return this.client.hset('cmds', cmdMap);
  }

  async isCommandModOnly(cmdName: string): Promise<boolean> {
    return (await this.client.hget('cmds', cmdName)) === '1' ? true : false;
  }

  async updateCommandUsage(cmdName: string, userID: string) {
    await this.client.hincrby('24hcmdUsage', cmdName, 1);
    await this.client.hincrby(`commands:${cmdName}`, userID, 1);
    return this.client.hincrby('cmdUsage', cmdName, 1);
  }
}
