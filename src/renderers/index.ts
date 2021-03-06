import { WebhookPayload } from 'eris';
import { LotteryResults } from '../utils';

export const renderLotteryEmbed = (
  results: LotteryResults,
  winner?: { username: string; discriminator: string; wins: number }
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the lottery, how sad'
    };
  }

  const { amountWon, participantsCount, winnerID } = results;

  return {
    embeds: [
      {
        title: 'Lottery Winner!',
        description: `Winner: **${winner.username}#${
          winner.discriminator
        }**\nAmount: **\`${amountWon.toLocaleString()} coins\`**\n\nTotal amount of users that entered: **${participantsCount}**\nTotal amount of lotteries won: **${wins}**`,
        color: 0x00aa00,
        timestamp: new Date()
      }
    ],
    content: `<@${winnerID}>`
  };
};
