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

  const [bot, time, req, amt, winners, msg] = options.map(e => e.value);

  const embeds: EmbedOptions[] = [
    {
      title: `<:newgw:921680426219749437> donation from ${slash.member.user.username} <:newgw:921680426219749437>`,
      description:
        `<:blackdot:918201737985290329> **Bro or Dank Memer donation?:** ${bot}` +
        `\n<:blackdot:918201737985290329> **Time:** ${time}` +
        `\n<:blackdot:918201737985290329> **Requirement:** ${req}` +
        `\n<:blackdot:918201737985290329> **Amount:** ${amt}` +
        `\n<:blackdot:918201737985290329> **Winners:** ${winners}` +
        (msg ? `\n<:blackdot:918201737985290329> **message:** ${msg}` : ''),
      color: 2105893
    }
  ];

  return slash.reply({
    embeds,
    content: '<@&924368164911984670>: New donation!',
    allowedMentions: { roles: ['924368164911984670'] }
  });
}
