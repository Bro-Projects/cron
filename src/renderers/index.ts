import type { EmbedOptions, User, WebhookPayload } from 'eris';
import type { GiveawayDB, LotteryResults, RestUser } from '@typings';
import { getAvatarURL, randomColour } from '@utils';
import items, { type itemNames } from '@assets/items';

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
          `Winner: **${winner.username}#${winner.discriminator}**\n` +
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
          `Winner: **${winner.username}#${winner.discriminator}**\n` +
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

  const getItemInfo = (itemID: itemNames) => {
    const item = items[itemID];
    return `${item.icon} ${item.name}:`;
  };

  function increment(
    data: Map<string, string | number>,
    key: string,
    itemID: string,
    value = 1
  ) {
    let amount = (data.get(key) as number) ?? 0;
    amount += value;
    data.set(
      'inventory',
      Number((amount * items[itemID]?.price ?? 0) / 4) ?? 0
    );
  }

  for (const item of Object.values(items)) {
    const amount = newData.get(item.id) ?? 0;
    const exists = differences.has(item.id);
    if (amount > 0) {
      increment(differences, 'inventory', item.id, amount);
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
  data: Record<string, string>
): WebhookPayload => {
  return {
    embeds: [
      {
        title: 'Command usage in the past 1 hour',
        description: Object.entries(data)
          .sort((a, b) => +b[1] - +a[1])
          .map((val) => `**${val[0]}**: ${Number(val[1]).toLocaleString()}`)
          .join('\n'),
        footer: {
          text: `Total: ${Object.values(data).reduce((a, b) => +a + +b, 0).toString()}`
        },
        timestamp: new Date(),
        color: randomColour()
      }
    ]
  };
};
