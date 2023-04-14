import type { Config, DevConfig } from '@typings';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';
import { Collection } from '@discordjs/collection';
import { randomBytes } from 'crypto';

export const randomColour = (): number => {
  return Math.floor(Math.random() * 0xffffff);
};

export const loadAnyConfig = <T = Record<string, unknown>>(
  filename: string
): T => {
  const path =
    process.env.NODE_ENV === 'production'
      ? `/home/bro/configs/cron/${filename}`
      : resolve(__dirname, '..', '..', filename);

  return JSON.parse(readFileSync(path, 'utf8'));
};

export const loadConfig = () => loadAnyConfig<Config>('config.json');

export const loadDevConfig = () => loadAnyConfig<DevConfig>('config.dev.json');

export const getAvatarURL = (
  userID = '543624467398524935',
  avatarHash = 'c3bb063001b08d4d295673ff4510741a.png'
): string => {
  return `https://cdn.discordapp.com/avatars/${userID}/${avatarHash}.${
    avatarHash.startsWith('a_') ? 'gif' : 'png'
  }?=1024`;
};

export const prettyDate = (): string => {
  const d = new Date(Date.now() - 1.44e7); // UTC to UTC -4
  const methods = ['getHours', 'getMinutes', 'getSeconds'];
  return `${methods
    .map((m) => d[m]().toString().padStart(2, '0'))
    .join(':')} —— ${d.toLocaleDateString()}`;
};

export const log = (message: string | Record<string, unknown>): void => {
  const date = prettyDate();
  const msg = message instanceof Object ? inspect(message) : message;
  console.log(`[${date}] ${msg}`);
};

export const randomInArray = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const getUptime = (): string =>
  `<t:${Math.round(Date.now() / 1000 - process.uptime())}:R>`;

export const formatTime = (time = Date.now(), format = 'R') => {
  return `<t:${Math.round(time / 1000)}:${format}>`;
};

export const codeblock = (text: string, language = 'javascript'): string => {
  const backticks = '```';
  return `${backticks}${language ?? ''}\n${text}\n${backticks}`;
};

export const escapeRegex = (str: string): string =>
  str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export class BroCollection extends Collection<string, any> {
  increment(key: string, value = 1) {
    let amount = this.get(key) ?? 0;
    amount += value;
    return this.set(key, amount);
  }
}

export const generateUniqueID = (length: number): string => {
  return randomBytes(length / 2)
    .toString('hex')
    .toUpperCase();
};
