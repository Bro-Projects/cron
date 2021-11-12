import type { User, Guild, Snowflake, EmbedOptions } from 'eris';
import type Database from '../structures/Database';
import type Client from '../structures/Client/Client';

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

export type GenericEntity = {
  _id?: string;
};

export type Giveaway = {
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
} & GenericEntity;

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
    mongoURI: string;
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
}

export type BankDB = {
  pocket: number;
  bank: number;
} & GenericEntity;

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
    passive: boolean;
    dmsDisabled: boolean;
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
  items: Object;
  upgrades: {
    multi: number;
    shares: number;
    luck: number;
    space: number;
    coupon: number;
  };
  donor: boolean;
} & GenericEntity;

export type genericTask = (this: context) => void;
