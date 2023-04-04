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
      differenceItemData += `- ${getItemInfo(item.id)} ${formattedDifferences.get(
        item.id
      )}\n`;
    }
  }

  formattedDifferences.set('inventory', toLocale(newData.get('inventory') - oldData.get('inventory')));

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
        description: `**Coins**\nPocket: ${
          formattedDifferences.get('pocket')
        }\nBank: ${
          formattedDifferences.get('bank') ?? 0
        }\n\n**Total Inventory Worth**\n${
          formattedDifferences.get('inventory')
        }\n\n**Items**\n${
          differenceItemData === '' ? 'No item data' : differenceItemData
        }`
      }
    ]
  };
};

const rules = {
  title: 'Bot Rules',
  description:
    '**1.** No automation of commands — this includes but is not limited to: autotypers, userbots/selfbots.\n\n' +
    "**2.** Don't spam commands — wait for the bot to respond before sending another command. If it's extremely laggy then let a developer know.\n\n" +
    '**3.** No alternative accounts/secondary accounts are to be used for the bot. This also means no blacklist/ban evasion by using a second account while an account you own is blacklisted or banned.\n\n' +
    "**4.** No external trading — coins _or_ items are not allowed to be exchanged for other bots' currencies, real money or any *paid* services.\n\n" +
    "**5.** Racial slurs, targeted hate towards anyone or specific groups, aren't allowed.\n\n" +
    "**6.** Follow **[Discord's Terms of Service](https://discord.com/terms)** and their **[Community Guidelines](https://discord.com/guidelines)**.\n\n" +
    "**7.** Please don't create drama or spread rumours about the bot/users, it only spreads negativity which is unnecessary. Report a real issue to bot owners (<@434613993253109760>/<@266432078222983169>) or the **[support server](https://discord.gg/mUYBKjSU2V)** if needed.\n\n" +
    "**8.** Scamming in **[Bro Community](https://discord.gg/ZV6syzJmQD)** will get you banned as it's the official community for Bro.\n\n" +
    '**9.** Bad friends — Not reporting known cheaters is a bannable offense. This also applies to users who receive massive amounts of coins or items randomly from cheaters/exploiters for no reason. Remember, no one will give you free stuff. Contact support instead of spending these coins.',
  footer: {
    text: 'Last updated on July 2nd, 2022',
    icon_url:
      'https://cdn.discordapp.com/avatars/543624467398524935/e4ac5faef283425eb128dac16bbeb2c2.png?size=1024'
  },
  color: 8613887
};

export const renderUserBan = (
  type: 'ban' | 'tempban',
  reason: string,
  days = 0
) => {
  const data = {
    title: `You have been ${
      type === 'ban' ? '' : 'temporarily '
    }banned from using the bot`,
    description: `You broke one of the bot's rules and this has resulted in a ${
      type === 'ban'
        ? 'permanent ban'
        : `**temporary ban for \`${days}\` days**`
    }.\n\nBan reason: ${reason}`,
    color: type === 'ban' ? 15548997 : 16427034
  };
  return {
    embeds: [
      {
        ...rules
      },
      {
        author: {
          name: data.title
        },
        description: data.description,
        color: data.color,
        timestamp: new Date()
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
            .reduce((a, b) => +a + +b, 0)
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
