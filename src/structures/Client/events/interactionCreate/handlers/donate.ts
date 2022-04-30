import type {
  CommandInteraction,
  EmbedOptions,
  InteractionDataOptionsWithValue
} from 'eris';
import type { context } from '@typings';

export async function donate(this: context, slash: CommandInteraction) {
  if (slash.channel.id !== '862310524184035349') {
    slash.reply({
      embeds: [
        {
          description:
            "You can't use this here, please go to <#862310524184035349>"
        }
      ]
    });
    return;
  }

  const options = slash.data.options as InteractionDataOptionsWithValue[];

  const [bot, time, req, amt, winners, msg] = options.map((e) => e.value);

  const embeds: EmbedOptions[] = [
    {
      title: `🎉 New donation from ${slash.member.user.username} 🎉`,
      description:
        `**Bro or Dank Memer donation?:** ${bot}` +
        `\n**Time:** ${time}` +
        `\n**Requirement:** ${req}` +
        `\n**Amount:** ${amt}` +
        `\n**Winners:** ${winners}` +
        (msg ? `\n**Message:** ${msg}` : ''),
      color: 2105893
    }
  ];

  return slash.reply({
    embeds,
    content: '<@&924368164911984670>: New donation!',
    allowedMentions: { roles: true }
  });
}
