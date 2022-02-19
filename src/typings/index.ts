import type { User, Guild, Snowflake, EmbedOptions } from 'eris';
import type { Redis } from 'ioredis';
import type Database from '@structs/Database';
import type Client from '@structs/Client';
import type { itemNames } from '@assets/items';

export type LotteryResults = {
  winnerID: string;
  amountWon: number;
  participants: number;
};

export type webhookOptions = {
  content?: string;
  embeds?: EmbedOptions[];
  username?: string;
  avatarURL?: string;
};

export type GenericEntity = {
  _id?: string;
};

export type GiveawayDB = {
  channelID: Snowflake;
  createdBy: {
    id: User['id'];
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
    itemID: itemNames | null;
  };
  msgLink: string;
  rewardInfo: string;
} & GenericEntity;

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
  };
  keys: {
    discord: string;
    mongoURI: string;
  };
};

export type DevConfig = {
  commands: string[];
  servers: string[],
  tasks: string[]
};

export type RestUser = {
  id: Snowflake;
  avatar: string;
  username: string;
  discriminator: string;
  tag: RestUser['username'] & RestUser['discriminator'];
  publicFlags: number;
};

export type GenericRenderResult = {
  content: string;
  embed: EmbedOptions;
};

export interface context {
  config: Config;
  devConfig ?: DevConfig;
  db: Database;
  client: Client;
  giveaways: Map<string, GiveawayDB>;
  reminders: Map<string, ReminderDB>;
  redis: Redis;
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

export type ReminderDB = {
  type: 'vote' | 'genericReminder' | 'role-removal';
  expiresAt: number;
  userID: string;
  dmID: string;
  message?: string | EmbedOptions;
} & GenericEntity;

export type genericTask = (this: context) => void;
