import type { RestUser, context } from '@typings';
import axios from 'axios';
import {
  ClientOptions,
  Client as DiscordClient,
  MessageCreateOptions,
  MessagePayload,
  WebhookClient,
  WebhookMessageCreateOptions
} from 'discord.js';
import * as events from './events';
import Sentry from '@structs/Sentry';

export default class Client extends DiscordClient {
  private baseURL = 'https://discord.com/api/v10';

  constructor(options: ClientOptions) {
    super(options);
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

  async removeGuildMemberRole(
    guildID: string,
    userID: string,
    roleID: string
  ): Promise<void> {
    try {
      const guild = await this.guilds.fetch(guildID);
      const member = await guild.members.fetch({ user: userID, force: true });
      await member.roles.remove(roleID, 'Role expiry task');
    } catch (err) {
      console.error(err);
    }
  }

  async sendWebhookMessage(
    id: string,
    token: string,
    options: string | MessagePayload | WebhookMessageCreateOptions
  ) {
    const webhookClient = new WebhookClient({ id, token });

    try {
      await webhookClient.send(options);
    } catch (err) {
      console.error(err);
    }
  }

  async getRESTUser(userID: string): Promise<Partial<RestUser>> {
    const user = await axios.get(this.userEndpoint(userID), {
      headers: {
        Authorization: this.token
      }
    });
    return user.data;
  }

  async dm(
    userID: string,
    messageOptions: string | MessagePayload | MessageCreateOptions
  ) {
    const user = await this.users.fetch(userID, { force: true });
    const DMChannel = await user.createDM(true);

    try {
      await DMChannel.send(messageOptions);
    } catch (err) {
      console.error(err);
    }
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
