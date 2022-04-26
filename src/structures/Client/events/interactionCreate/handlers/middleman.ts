import type {
  CommandInteraction,
  EmbedOptions,
  InteractionDataOptionsWithValue
} from 'eris';
import type { context } from '@typings';

export async function middleman(this: context, slash: CommandInteraction) {
  const guild = await this.client.getRESTGuild(slash.guildID);

  if (!slash.member.roles.includes('862466397485793320')) {
    slash.reply({
      embeds: [
        {
          description:
            "You can't use this yet, You need to be at least level 5."
        }
      ]
    });
    return;
  }

  if (slash.channel.id !== '920233527331659776') {
    slash.reply({
      embeds: [
        {
          description:
            "You can't use this here, please go to <#920233527331659776>"
        }
      ]
    });
    return;
  }

  const options = slash.data.options as InteractionDataOptionsWithValue[];

  const targetID = options[0].type === 6 && options[0].value;
  const target = slash.data.resolved.users.get(targetID);

  const [, offerOne, offerTwo] = options.map((e) => e.value);

  const embeds: EmbedOptions[] = [
    {
      title: 'Someone wants you to help them with a trade!',
      description:
        `Request sent from: ${slash.member.user.mention}` +
        `\nTrader: ${target.mention}` +
        `\n${slash.member.user.mention}'s offer: ${offerOne}` +
        `\n${target.mention}'s offer: ${offerTwo}`,
      color: 65793,
      footer: { icon_url: guild.iconURL, text: guild.name }
    }
  ];

  return slash.reply({
    embeds,
    content: '<@&862518397564616704>: New middleman request',
    allowedMentions: { roles: ['862518397564616704'] }
  });
}
