import { WebhookPayload } from 'eris';
import { getAvatarURL, randomColour } from '../utils';
import { LotteryResults, RestUser } from '../typings';

export const renderHourlyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number },
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the hourly lottery, how sad',
    };
  }

  const { amountWon, participantsCount, winnerID } = results;
  const usertag = `${winner.username}#${winner.discriminator}`;

  return {
    embeds: [
      {
        title: '🎟️ Hourly Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins\n` +
          `Item: Lottery Ticket 🎟️\n\n` +
          `Total amount of users that entered: **${participantsCount}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar) || 'https://cdn.discordapp.com/avatars/543624467398524935/c3bb063001b08d4d295673ff4510741a.png'
        }
      },
    ],
    content: `<@${winnerID}>`,
  };
};

export const renderDailyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number },
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the daily lottery, how sad',
    };
  }

  const { amountWon, participantsCount, winnerID } = results;
  const usertag = `${winner.username}#${winner.discriminator}`;

  return {
    embeds: [
      {
        title: '🎟️ Daily Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins\n` +
          `Item: Lottery Ticket 🎟️\n\n` +
          `Total amount of users that entered: **${participantsCount}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar) || 'https://cdn.discordapp.com/avatars/543624467398524935/c3bb063001b08d4d295673ff4510741a.png'
        }
      },
    ],
    content: `<@${winnerID}>`,
  };
};

export const renderWeeklyEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number },
): WebhookPayload => {
  const { amountWon, participantsCount, winnerID } = results;
  const usertag = `${winner.username}#${winner.discriminator}`;
  
  return {
    embeds: [
      {
        title: '🎫 Weekly Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins (using coupon item)\n` +
          `Item: Coupon 🎫\n\n` +
          `Total amount of users that entered: **${participantsCount}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: 0,
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      },
    ],
    content: `<@${winnerID}>`,
  };
};
