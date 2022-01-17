import { EmbedOptions, User, WebhookPayload } from 'eris';
import type { GiveawayDB, LotteryResults, RestUser } from '../typings';
import { getAvatarURL, randomColour } from '../utils';

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
  if (!results) {
    return {
      content: 'No one entered the daily lottery, how sad'
    };
  }

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
          text: 'Remember to give us 5 stars on top.gg too',
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
