import type { EmbedField, User, WebhookPayload } from 'eris';
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
): WebhookPayload => {
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
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      }
    ],
    content: `<@${winnerID}>`
  };
};

export type VoteSite = 'topgg';

export const renderVoteReminderEmbed = (
  user: User,
  voteSite: VoteSite = 'topgg'
): WebhookPayload => {
  const topggBotVoteURL = 'https://top.gg/bot/543624467398524935/vote';
  const otherVoteSiteURL = 'https://www.google.com/';
  return {
    embeds: [
      {
        title: '<:timer:931688035819585616> Vote Reminder',
        description: `Hey ${user.username}, you can vote again on ${
          voteSite === 'topgg' ? 'top.gg' : '(placeholder)'
        }`,
        color: 0x81a561,
        timestamp: new Date(),
        footer: {
          text: 'Thanks for the support! <3',
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
            label: voteSite === 'topgg' ? 'top.gg' : '(placeholder)',
            url: voteSite === 'topgg' ? topggBotVoteURL : otherVoteSiteURL
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

  const itemDataLines = itemData
    .split('\n')
    .filter((line) => line.trim() !== '');
  const chunkSize = 15;
  const maxFields = 25;
  const numChunks = Math.ceil(itemDataLines.length / chunkSize);
  const fields: EmbedField[] = [];

  for (let i = 0; i < Math.min(numChunks, maxFields); i++) {
    const startIndex = i * chunkSize;
    const chunk = itemDataLines.slice(startIndex, startIndex + chunkSize);
    const name = `Field #${i + 1}`;
    const value = chunk.join('\n');
    fields.push({
      name,
      value,
      inline: true
    });
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
        )}\n\n`,
        fields,
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
): WebhookPayload => {
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
            .reduce((a, b) => a + +b, 0)
            .toLocaleString()}`
        },
        timestamp: new Date(),
        color: randomColour()
      }
    ]
  };
};

export const renderTopCommandUsage = (
  commandCounts: CommandCounts,
  uniqueID: string,
  rolePing = true
): WebhookPayload => {
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
