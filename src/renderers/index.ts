import { WebhookPayload } from 'eris';
import { getAvatarURL, randomColour } from '../utils';
import { LotteryResults, RestUser, GenericRenderResult } from '../typings';

export const renderLotteryEmbed = (
  results: LotteryResults,
  winner?: Partial<RestUser> & { wins: number },
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
        title: '🎟️ Lottery Winner!',
        description:
          `Winner: **${usertag}**\n` +
          `Amount: **\`${amountWon.toLocaleString()}\`** coins\n\n` +
          `Total amount of users that entered: **${participantsCount}**\n` +
          `Total amount of lotteries won: **${winner.wins}**`,
        color: randomColour(),
        timestamp: new Date(),
        thumbnail: {
          url: getAvatarURL(winner.id, winner.avatar)
        }
      },
    ],
    content: `<@${winnerID}>`,
  };
};

export const renderLotteryReminder = (): GenericRenderResult => {
  return {
    content: '',
    embed: {
      title: 'Lottery was just drawn',
      description: `You can join the new lottery now or see the winner of the last lottery here: <#816669934218117160>\n\nRun \`bro toggledms\` if you don't want to receive these reminders.`,
      timestamp: new Date(),
    },
  };
};
