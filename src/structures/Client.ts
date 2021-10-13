import type { EmbedOptions, Message, PrivateChannel } from 'eris';
import type { RestUser, webhookOptions } from '../typings';
import axios from 'axios';

export default class Client {
  private baseURL = 'https://discord.com/api/v8';

  constructor(private discordBotToken: string) {}

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

  async executeWebhook(
    webhookID: string,
    token: string,
    options: webhookOptions,
  ): Promise<void> {
    await axios.post(this.webhookToken(webhookID, token), {
      content: options.content,
      embeds: options.embeds,
      username: options.username,
      avatar_url: options.avatarURL,
      tts: false,
      allowed_mentions: { parse: ['users'] },
    });
  }

  async getRESTUser(userID: string): Promise<Partial<RestUser>> {
    const user = await axios.get(this.userEndpoint(userID), {
      headers: {
        Authorization: `Bot ${this.discordBotToken}`,
      },
    });
    return user.data;
  }

  async getDMChannel(userID: string): Promise<Partial<PrivateChannel>> {
    const privateChannel = await axios.post(
      this.userDmEndpoint(),
      {
        recipients: [userID],
        type: 1,
      },
      {
        headers: {
          Authorization: `Bot ${this.discordBotToken}`,
        },
      },
    );
    return privateChannel.data;
  }

  async dm(
    channelID: string,
    data: { content: string; embed: EmbedOptions },
  ): Promise<Message> {
    const msg = await axios.post(
      this.channelMessagesEndpoint(channelID),
      {
        content: data.content ?? '',
        embed: data.embed,
      },
      {
        headers: {
          Authorization: `Bot ${this.discordBotToken}`,
        },
      },
    );
    return msg.data;
  }
}
