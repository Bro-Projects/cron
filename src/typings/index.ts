import type { User, Guild, Snowflake, EmbedOptions } from 'eris';
import type Database from '../structures/Database';
import type Client from '../structures/Client';
import type { Redis } from 'ioredis';

export type LotteryResults = {
  winnerID: string;
  amountWon: number;
  participantsCount: number;
};

export type webhookOptions = {
  content?: string;
  embeds?: EmbedOptions[];
  username?: string;
  avatarURL?: string;
};

export type Giveaway = {
  id: Snowflake;
  channelID: Snowflake;
  createdBy: {
    id: Snowflake;
    tag: User['tag'];
  };
  guild: {
    id: Guild['id'];
    name: Guild['name'];
  };
  participants: string[];
  ended: boolean;
  endsAt: number;
  forCron: boolean;
  info: {
    winners: number;
    type: string;
    amount: string | number;
    itemID: string | null;
  };
  msgLink: string;
  rewardInfo: string;
};

export type WebhookInfo = {
  hookID: string;
  token: string;
};

export type Config = {
  webhooks: {
    lottery: WebhookInfo;
    dm: WebhookInfo;
  };
  keys: {
    discord: string;
  };
};

export type RestUser = {
  id: string;
  avatar: string;
  username: string;
  discriminator: string;
  publicFlags: number;
};

export type GenericRenderResult = {
  content: string;
  embed: EmbedOptions;
};

export interface context {
  config: Config;
  db: Database;
  client: Client;
  giveaways: Map<string, Giveaway>;
  redis: Redis;
}

export type genericTask = (this: context) => void;
