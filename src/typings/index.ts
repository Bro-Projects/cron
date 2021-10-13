import type { EmbedOptions } from 'eris';
import type Database from '../structures/Database';
import type Client from '../structures/Client';

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

export type WebhookInfo = {
  hookID: string;
  token: string;
};

export type Config = {
  webhooks: {
    lottery: WebhookInfo;
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
}

export type genericTask = (this: context) => void;
