import { EmbedOptions, MessageContent, PrivateChannel } from 'eris';
import axios from 'axios';

type webhookOptions = {
  content?: string;
  file?: Object;
  embeds?: EmbedOptions[];
  username?: string;
  avatarURL?: string;
};

export default class Client {
  private baseURL: string = 'https://discord.com/api/v8';

  constructor(private discordBotToken: string) {}

  webhookToken(hookID: string, token: string) {
    return `${this.baseURL}/webhooks/${hookID}/${token}`;
  }

  userEndpoint(id: string) {
    return `${this.baseURL}/users/${id}`;
  }

  userDmEndpoint() {
    return `${this.baseURL}/users/@me/channels`;
  }
  
  channelMessagesEndpoint(channelID: string) {
    return `${this.baseURL}/channels/${channelID}/messages`
  }

  async executeWebhook(
    webhookID: string,
    token: string,
    options: webhookOptions
  ) {
    if (!options.content && !options.file && !options.embeds) {
      return Promise.reject(new Error('No content, file, or embeds'));
    }
    await axios.post(this.webhookToken(webhookID, token), {
      content: options.content,
      embeds: options.embeds,
      username: options.username,
      avatar_url: options.avatarURL,
      tts: false,
      allowed_mentions: { parse: ['users'] }
    });
    console.log(`Posted lottery successfully ${new Date()}`);
  }

  async getRESTUser(userID: string) {
    const user = await axios.get(this.userEndpoint(userID), {
      headers: {
        Authorization: `Bot ${this.discordBotToken}`
      }
    });
    return user;
  }

  async getDMChannel(userID: string): Promise<Partial<PrivateChannel>> {
    const privateChannel = await axios
      .post(this.userDmEndpoint(), {
        recipients: [userID],
        type: 1
      }, {
        headers: {
          Authorization: `Bot ${this.discordBotToken}`
        }
      });
    return privateChannel as unknown;
  }

  async dm(channelID: string, content: string, embed: EmbedOptions) {
    const msg = await axios.post(this.channelMessagesEndpoint(channelID), {
      content,
      embed,
    }, {
      headers: {
        Authorization: `Bot ${this.discordBotToken}`
      }
    });
    return msg;
  }
}
