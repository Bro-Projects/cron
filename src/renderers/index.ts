import { WebhookPayload } from 'eris';
import { LotteryResults, randomColour } from '../utils';

export const renderLotteryEmbed = (
  results: LotteryResults,
  winner?: { username: string; discriminator: string; wins: number },
): WebhookPayload => {
  if (!results) {
    return {
      content: 'No one entered the lottery, how sad',
    };
  }

  const { amountWon, participantsCount, winnerID } = results;

  const usertag = `${winner.username}#${winner.discriminator}`;
  return {
    embeds: [
      {
        title: 'Lottery Winner!',
        description: `Winner: **${usertag}**\n`
        + `Amount: **\`${amountWon.toLocaleString()} coins\`**\n\n`
        + `Total amount of users that entered: **${participantsCount}**\n`
        + `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date(),
      },
    ],
    content: `<@${winnerID}>`,
  };
};
