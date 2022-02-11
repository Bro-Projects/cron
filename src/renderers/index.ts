import type { EmbedOptions, User, WebhookPayload } from 'eris';
import type { GiveawayDB, item, LotteryResults, RestUser } from '@typings';
import { getAvatarURL, randomColour } from '@utils';
import items from '@assets/items';

export const renderGiveaways = (giveaways: GiveawayDB[]): EmbedOptions => {
  let description = '';
  let number = 1;

  for (const giveaway of giveaways) {
    description += `${number}. In **${giveaway.guild.name}** — [↗️](${giveaway.msgLink})\n - ${giveaway.rewardInfo}\n\n`;
    number++;
  }
  return {
    title: 'Active Giveaways',
    description,
    timestamp: new Date(),
    color: randomColour()
  };
};

export const renderHourlyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number }
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the hourly lottery, how sad'
    };
  }

  const { winnerID, amountWon, participants } = results;
  return {
    embeds: [
      {
        title: '🎟️ Hourly Lottery Winner!',
        description:
          `Winner: **${winner.tag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins\n` +
          `Item: Lottery Ticket 🎟️\n\n` +
          `Total amount of users that entered: **${participants}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      }
    ],
    content: `<@${winnerID}>`
  };
};

export const renderDailyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number }
): WebhookPayload => {
  const { amountWon, participants, winnerID } = results;

  return {
    embeds: [
      {
        title: '🎟️ Daily Lottery Winner!',
        description:
          `Winner: **${winner.tag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins\n` +
          `Item: Lottery Ticket 🎟️\n\n` +
          `Total amount of users that entered: **${participants}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: 0,
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      }
    ],
    content: `<@${winnerID}>`
  };
};

export const renderWeeklyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number }
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the weekly lottery, how sad'
    };
  }

  const { amountWon, participants, winnerID } = results;
  const usertag = `${winner.username}#${winner.discriminator}`;

  return {
    embeds: [
      {
        title: '🎫 Weekly Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins (using coupon item)\n` +
          `Item: Coupon 🎫\n\n` +
          `Total amount of users that entered: **${participants}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: 0,
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      }
    ],
    content: `<@${winnerID}>`
  };
};

export const renderVoteReminderEmbed = (user: User): WebhookPayload => {
  const topggBotVoteURL = 'https://top.gg/bot/543624467398524935/vote';
  return {
    embeds: [
      {
        title: '<:timer:931688035819585616> Vote Reminder',
        description: `Hey ${user.username}, you can vote again!`,
        color: 0x81a561,
        timestamp: new Date(),
        footer: {
          text: 'Thanks for the support!',
          icon_url: user.dynamicAvatarURL()
        }
      }
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            label: 'top.gg',
            url: topggBotVoteURL
          }
        ]
      }
    ]
  };
};

export const renderCurrencyStatsEmbed = async (
  oldDataString: string | null,
  newDataString: string | null
): Promise<WebhookPayload> => {
  if (!oldDataString || !newDataString) {
    return {
      content: 'Received insufficient data to create a proper log.'
    };
  }

  const oldData: Map<string, number> = new Map(
    Object.entries(JSON.parse(oldDataString))
  );

  const newData: Map<string, number> = new Map(
    Object.entries(JSON.parse(newDataString))
  );
  const differences: Map<string, string | number> = new Map();

  for (const [key] of newData) {
    const oldValue = oldData.get(key);
    const newValue = newData.get(key);
    let difference: string | number;

    if (newValue < oldValue) {
      difference = `**-${Number(oldValue - newValue).toLocaleString()}**`;
    } else if (newValue > oldValue) {
      difference = `**+${Number(newValue - oldValue).toLocaleString()}**`;
    } else {
      difference = 0;
    }
    if (difference !== 0) {
      differences.set(key, difference);
    }
  }

  const createdAt = `<t:${Math.round(
    (newData.get('time') ?? Date.now()) / 1000
  )}>`;
  let itemData = '';
  let differenceItemData = '';

  const toLocale = (number = 0) =>
    `**\`${Math.round(number).toLocaleString()}\`**`;

  const getItemInfo = (itemID: item['id']) => {
    const item = Object.values(items).find((i) => i.id === itemID);
    return `${item.icon} ${item.name}:`;
  };

  for (const item of Object.values(items)) {
    const amount = newData.get(item.id) ?? 0;
    const exists = differences.has(item.id);
    if (amount > 0) {
      itemData += `- ${getItemInfo(item.id)} ${toLocale(amount)}\n`;
    }
    if (exists) {
      differenceItemData += `- ${getItemInfo(item.id)} ${differences.get(
        item.id
      )}\n`;
    }
  }

  return {
    embeds: [
      {
        title: 'Global Currency Data',
        description: `Stats as of ${createdAt}\n\n**Coins**\nPocket: ${toLocale(
          newData.get('pocket')
        )}\nBank: ${toLocale(
          newData.get('bank')
        )}\n\n**Total Inventory Worth**\n${toLocale(
          newData.get('inventory')
        )}\n\n**Items**\n${itemData === '' ? 'No item data' : itemData}`,
        color: randomColour()
      },
      {
        title: `Changes since the last set of stats were logged`,
        description: `**Coins**\nPocket: ${differences.get('pocket')}\nBank: ${
          differences.get('bank') ?? 0
        }\n\n**Total Inventory Worth**\n${differences.get(
          'inventory'
        )}\n\n**Items**\n${
          differenceItemData === '' ? 'No item data' : differenceItemData
        }`
      }
    ]
  };
};
