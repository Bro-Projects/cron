import type { Config } from './typings';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { inspect } from 'util';

export const randomColour = (): number => {
  return Math.floor(Math.random() * 0xffffff);
};

export const loadConfig = (): Config =>
  JSON.parse(readFileSync(resolve(__dirname, '..', 'config.json'), 'utf8'));

export const getAvatarURL = (userID: string, avatarHash: string): string => {
  if (!avatarHash) {
    return 'https://cdn.discordapp.com/avatars/543624467398524935/c3bb063001b08d4d295673ff4510741a.png';
  }
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

export const log = (message: string | Object): void => {
  const date = prettyDate();
  const msg = message instanceof Object ? inspect(message) : message;
  console.log(`[${date}] ${msg}`);
};

export const randomInArray = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const getUptime = (): string =>
  `<t:${Math.round(Date.now() / 1000 - process.uptime())}:R>`;
