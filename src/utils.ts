import cron from 'node-cron';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export type WebhookInfo = {
  id: string;
  token: string;
};

export type Config = {
  webhooks: {
    lottery: WebhookInfo;
  };
  keys: {
    discord: string;
  }
};

export type LotteryResults = {
  winnerID: string;
  amountWon: number;
  participantsCount: number;
};

export const createTask = (fn: (...args: any[]) => void) => {
  return cron.schedule('0 * * * * *', fn);
};

export const loadConfig = (): Config =>
  JSON.parse(readFileSync(resolve(__dirname, '..', 'config.json'), 'utf8'));
