import {
  Client as ErisClient,
  ClientOptions,
  EmbedOptions,
  Message,
  PrivateChannel
} from 'eris';
import type { context, RestUser, webhookOptions } from '@typings';
import * as events from './events';
import axios from 'axios';
import Sentry from '@structs/Sentry';

export default class Client extends ErisClient {
  private baseURL = `https://discord.com/api/v10`;

  constructor(private token: string, options: ClientOptions) {
    super(token, options);
  }

  webhookToken(hookID: string, token: string): string {
    return `${this.baseURL}/webhooks/${hookID}/${token}`;
  }

  userEndpoint(id: string): string {
    return `${this.baseURL}/users/${id}`;
  }

  userDmEndpoint(): string {
    return `${this.baseURL}/users/@me/channels`;
  }

  channelMessagesEndpoint(channelID: string): string {
    return `${this.baseURL}/channels/${channelID}/messages`;
  }

  async _executeWebhook(
    webhookID: string,
    token: string,
    options: webhookOptions
  ): Promise<void> {
    await axios.post(this.webhookToken(webhookID, token), {
      content: options.content,
      embeds: options.embeds,
      username: options.username,
      avatar_url: options.avatarURL,
      tts: false,
      allowed_mentions: { parse: ['users'] }
    });
  }

  async _getRESTUser(userID: string): Promise<Partial<RestUser>> {
    const user = await axios.get(this.userEndpoint(userID), {
      headers: {
        Authorization: this.token
      }
    });
    return user.data;
  }

  async _getDMChannel(userID: string): Promise<Partial<PrivateChannel>> {
    const privateChannel = await axios.post(
      this.userDmEndpoint(),
      {
        recipients: [userID],
        type: 1
      },
      {
        headers: {
          Authorization: this.token
        }
      }
    );
    return privateChannel.data;
  }

  async dm(
    channelID: string,
    data: { content: string; embed: EmbedOptions }
  ): Promise<Message> {
    const msg = await axios.post(
      this.channelMessagesEndpoint(channelID),
      {
        content: data.content ?? '',
        embed: data.embed
      },
      {
        headers: {
          Authorization: this.token
        }
      }
    );
    return msg.data;
  }

  public loadEvents(context: context): void {
    for (const event of Object.values(events)) {
      this[event.once ? 'once' : 'on'](
        event.packetName as string,
        async () => {
          try {
            await event.handler.call(context);
          } catch (error) {
            console.error(error);
            Sentry.captureException(error);
          }
        }
      );
    }
  }
}
