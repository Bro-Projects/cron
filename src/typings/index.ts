import type { APIEmbed } from 'discord.js';
import type { Database, ReminderDocument } from 'bro-database';
import type Client from '@structs/Client';
import type { itemNames } from '@assets/items';
import type RedisClient from '@structs/Redis';

export type LotteryResults = {
  winnerID: string;
  amountWon: number;
  participants: number;
  fee: number;
};

export type GenericEntity = {
  _id?: string;
};

export type WebhookInfo = {
  hookID: string;
  token: string;
};

export type Config = {
  env: 'dev' | 'prod';
  owners: string[];
  webhooks: {
    lottery: WebhookInfo[];
    reminders: WebhookInfo;
    stats: WebhookInfo;
    cmdUsage: WebhookInfo;
    userCmdUsage: WebhookInfo;
  };
  keys: {
    discord: string;
    mongoURI: string;
    topgg: string;
    redis: string;
  };
  modOnly: boolean;
};

export type DevConfig = {
  commands: string[];
  servers: string[];
  tasks: string[];
};

export type BanData = {
  id: string;
  wipe: boolean;
  reason: string;
  type: 'ban' | 'tempban';
  days?: number;
};

export type RestUser = {
  id: string;
  avatar: string;
  username: string;
  discriminator: string;
  tag: RestUser['username'] & RestUser['discriminator'];
  publicFlags: number;
};

export type GenericRenderResult = {
  content: string;
  embed: APIEmbed;
};

export interface context {
  config: Config;
  devConfig?: DevConfig;
  db: Database;
  client: Client;
  reminders: Map<string, ReminderDocument>;
  redis: RedisClient;
}

export type JSONData = {
  pocket?: number;
  bank?: number;
  invWorth?: number;
  time: number;
};

export type item = {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  type?: string;
  date?: string;
  chances?: Record<string, number>;
};

export type BankDB = {
  pocket: number;
  bank: number;
} & GenericEntity;

export type LotteryDB = {
  hourly: 0 | 1;
  daily: 0 | 1;
  weekly: 0 | 1;
} & GenericEntity;

export type LotteryTypes = 'hourly' | 'daily' | 'weekly';

export type UserDB = {
  totalStats: {
    lost: number;
    won: number;
    shared: number;
    lotteryWins: number;
  };
  personalCooldowns: {
    lastStolenFrom: number;
    lastHeistedFrom: number;
    hourlyLottery: number;
    dailyLottery: number;
    weeklyLottery: number;
    streak: {
      streakCount: number;
      streakCooldown: number;
    };
  };
  preferences: {
    voteReminder: boolean;
    passive: boolean | number;
    dmsDisabled: boolean | number;
  };
  gameStats: {
    gamble: {
      amountWon: number;
      amountLost: number;
      gamesWon: number;
      gamesLost: number;
    };
    fullGamble: {
      gamesWon: number;
      gamesLost: number;
      lastGambledAmount: number;
      lastGambledAt: number;
      nextAvailableAt: {
        time: number;
        cmd: number;
      };
      result: number;
    };
  };
  pastBans: number;
  items: Record<itemNames, number>;
  upgrades: {
    multi: number;
    shares: number;
    luck: number;
    space: number;
    coupon: number;
  };
  donor: boolean;
} & GenericEntity;

export type UserExtraDB = {
  calendarProgress: {
    curDay: number;
    lastRedeemedAt: number;
  };
  swordData: {
    shards: number;
    hilt: number;
    blade: number;
    tip: number;
    effect?: 'speed' | 'healing' | 'extraLife' | 'poision';
    effectTill?: number;
    swordTier?: number;
  };
} & GenericEntity;

export type StatsDB = {
  stats: {
    clusters: unknown[];
    clustersRam: number;
    guilds: number;
    largeGuilds: number;
    masterRam: number;
    services: unknown[];
    servicesRam: number;
    shardCount: number;
    totalRam: number;
    users: number;
    voice: number;
  };
} & GenericEntity;

export type genericTask = (this: context) => void;
