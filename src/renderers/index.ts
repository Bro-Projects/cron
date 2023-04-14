import type {
  EmbedField,
  MessageCreateOptions,
  MessagePayload
} from 'discord.js';
import type { CommandCounts } from 'bro-database';
import type { LotteryResults, RestUser } from '@typings';
import { getAvatarURL, randomColour } from '@utils';
import items, { type itemNames } from '@assets/items';

function toLocale(num: number) {
  return `**\`${num.toLocaleString()}\`**`;
}

export const renderHourlyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number }
): string | MessagePayload | MessageCreateOptions => {
  if (!results) {
    return {
      content: 'No one entered the hourly lottery, how sad'
    };
  }

  const { winnerID, amountWon, fee, participants } = results;
  const amountWonWithoutFees = amountWon - fee;
  return {
    embeds: [
      {
        title: '🎟️ Hourly Lottery Winner!',
        description:
          `Winner: **${winner.username}#${winner.discriminator}**\n` +
          `Amount: ${toLocale(amountWonWithoutFees)} coins\n` +
          `Fee: ${toLocale(fee)} taken out\n` +
          `Item: 🎟️ Lottery Ticket\n\n` +
          `Total amount of users that entered: **${participants.toLocaleString()}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date().toISOString(),
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
): string | MessagePayload | MessageCreateOptions => {
  const { amountWon, participants, fee, winnerID } = results;
  const amountWonWithoutFees = amountWon - fee;
  return {
    embeds: [
      {
        title: '🎟️ Daily Lottery Winner!',
        description:
          `Winner: **${winner.username}#${winner.discriminator}**\n` +
          `Amount: ${toLocale(amountWonWithoutFees)} coins\n` +
          `Fee: ${toLocale(fee)} taken out\n` +
          `Item: 🎟️ Lottery Ticket\n\n` +
          `Total amount of users that entered: **${participants.toLocaleString()}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: 0,
        timestamp: new Date().toISOString(),
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
): string | MessagePayload | MessageCreateOptions => {
  if (!results) {
    return {
      content: 'No one entered the weekly lottery, how sad'
    };
  }

  const { amountWon, fee, participants, winnerID } = results;
  const usertag = `${winner.username}#${winner.discriminator}`;

  const amountWonWithoutFees = amountWon - fee;
  return {
    embeds: [
      {
        title: '🎫 Weekly Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: +${toLocale(amountWonWithoutFees)} in coupon balance\n` +
          `Fee: ${toLocale(fee)} taken out\n` +
          `Item: Coupon 🎫\n\n` +
          `Total amount of users that entered: **${participants.toLocaleString()}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: 0,
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      }
    ],
    content: `<@${winnerID}>`
  };
};

export const renderVoteReminderEmbed = (
  user: Partial<RestUser>
): string | MessagePayload | MessageCreateOptions => {
  const topggBotVoteURL = 'https://top.gg/bot/543624467398524935/vote';
  return {
    embeds: [
      {
        title: '<:timer:931688035819585616> Vote Reminder',
        description: `Hey ${user.username}, you can vote again!`,
        color: 0x81a561,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Thanks for the support!',
          icon_url: user.avatar
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
): Promise<string | MessagePayload | MessageCreateOptions> => {
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
  const differences: Map<string, number> = new Map();
  const formattedDifferences: Map<string, string> = new Map();

  for (const [key] of newData) {
    const oldValue = oldData.get(key);
    const newValue = newData.get(key);
    const delta = newValue - oldValue;

    if (delta !== 0) {
      differences.set(key, delta);
    }
  }

  for (const [key, value] of differences) {
    const sign = value > 0 ? '+' : '';
    formattedDifferences.set(key, `**${sign}${value.toLocaleString()}**`);
  }

  const createdAt = `<t:${Math.round(
    (newData.get('time') ?? Date.now()) / 1000
  )}>`;
  let itemData = '';
  let differenceItemData = '';

  const toLocale = (number = 0) =>
    `**\`${Math.round(number).toLocaleString()}\`**`;

  const getItemInfo = (itemID: itemNames) => {
    const item = items[itemID];
    return `${item.icon} ${item.name}:`;
  };

  for (const item of Object.values(items)) {
    const amount = newData.get(item.id) ?? 0;
    const exists = differences.has(item.id);
    if (amount > 0) {
      itemData += `- ${getItemInfo(item.id)} ${toLocale(amount)}\n`;
    }
    if (exists) {
      differenceItemData += `- ${getItemInfo(
        item.id
      )} ${formattedDifferences.get(item.id)}\n`;
    }
  }

  formattedDifferences.set(
    'inventory',
    `+${toLocale(newData.get('inventory') - oldData.get('inventory'))}`
  );

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
        description: `**Coins**\nPocket: ${formattedDifferences.get(
          'pocket'
        )}\nBank: ${formattedDifferences.get(
          'bank'
        )}\n\n**Total Inventory Worth**\n${formattedDifferences.get(
          'inventory'
        )}\n\n**Items**\n${
          differenceItemData === '' ? 'No item data' : differenceItemData
        }`
      }
    ]
  };
};

export const renderCmdUsage = (
  data: Record<string, string>,
  timeframe = '1 hour',
  rolePing?: boolean
): string | MessagePayload | MessageCreateOptions => {
  return {
    content: rolePing ? `<@&1057944139964108933>` : '',
    embeds: [
      {
        title: `Command usage in the past ${timeframe}`,
        description: Object.entries(data)
          .sort((a, b) => +b[1] - +a[1])
          .map((val) => `**${val[0]}**: ${Number(val[1]).toLocaleString()}`)
          .join('\n'),
        footer: {
          text: `Total: ${Object.values(data)
            .reduce((a, b) => +a + +b, 0)
            .toLocaleString()}`
        },
        timestamp: new Date().toISOString(),
        color: randomColour()
      }
    ]
  };
};

export const renderTopCommandUsage = (
  commandCounts: CommandCounts,
  uniqueID: string,
  rolePing = true
): string | MessagePayload | MessageCreateOptions => {
  // Get the top 50 users and # of commands ran
  const sortedCommandCounts = Object.entries(commandCounts).sort(
    (a, b) => b[1].total - a[1].total
  );
  const fields: EmbedField[] = [
    { name: 'Top 25', value: '', inline: true },
    { name: '25-50', value: '', inline: true }
  ];

  for (let i = 0; i < 50; i++) {
    const [userID, user] = sortedCommandCounts[i];
    const field = fields[Math.floor(i / 25)];
    field.value += `${i + 1}. <@${userID}>: ${user.total.toLocaleString()}\n`;
  }

  const footerText = `Total: ${Object.values(commandCounts)
    .reduce((acc, { total }) => acc + total, 0)
    .toLocaleString()} commands | ${Object.keys(
    commandCounts
  ).length.toLocaleString()} users`;

  return {
    content: rolePing ? `<@&1063225820719616100>` : '',
    embeds: [
      {
        title: `Top users by command usage in the past 8 hours (ID: ${uniqueID})`,
        fields,
        footer: {
          text: footerText,
          icon_url:
            'https://images-ext-1.discordapp.net/external/_wX9OcY0OsTQw5M2xznmCzxrpfc6SvsrnGjQs6TdXNs/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1014596357102768249/edf46e11c5b9f2adaa34d3018ae7d273.png?width=671&height=671'
        },
        color: randomColour()
      }
    ]
  };
};
