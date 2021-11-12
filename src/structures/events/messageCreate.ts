import type { EmbedOptions, Message } from 'eris';
import type Event from './Event';
import { getUptime, log, randomColour } from '../../utils';
import { renderGiveaways } from '../../renderers';

export const onMessageCreate: Event = {
  packetName: 'messageCreate',
  async handler(msg: Message) {
    // for some reason dms are undefined, it's supposed to be 1
    if (msg.channel.type === undefined) {
      let attachments: string;
      const toSend = [`**Content**:\n${msg.content}`];
      if (msg.attachments.length) {
        attachments = msg.attachments
          .map((a) => `[\`Attachment - ${a.filename}\`](${a.url})`)
          .join('\n');
        toSend.push(`**Attachments:\n${attachments}**`);
      }

      if (msg.author.bot) {
        return null;
      }

      await this.client
        .executeWebhook(
          this.config.webhooks.dm.hookID,
          this.config.webhooks.dm.token,
          {
            embeds: [
              {
                author: {
                  name: `DM Received from ${msg.author.tag}`,
                  icon_url: msg.author.dynamicAvatarURL(),
                },
                description: toSend.join('\n\n'),
                footer: {
                  text: `User ID: ${msg.author.id}`,
                },
                timestamp: new Date(),
                color: randomColour(),
              },
            ],
          },
        )
        .catch((e) => log(`[ERROR] Sending DM webhook: ${e.message}`));
    }

    if (msg.content !== 'cron stats') {
      return null;
    }

    const embeds: EmbedOptions[] = [
      {
        title: `Stats for cron instance`,
        description: `Uptime: ${getUptime()}\nGiveaways Active: **${
          this.giveaways.size
        }**`,
      },
    ];

    if (this.giveaways.size >= 1) {
      const giveaways = [...this.giveaways.values()];
      embeds[1] = renderGiveaways(giveaways);
    }

    await msg.reply({ embeds });
  },
};
