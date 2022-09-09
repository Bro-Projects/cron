import { renderUserBan } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

type banData = { id: string; wipe: boolean; reason: string; type: 'ban' | 'tempban', days?: number };

export default class DmUsersTask extends GenericTask {
  interval = '*/5 * * * *';

  async task(this: context): Promise<void> {
    const banData = await this.redis.lrange('dm:ban', 0, -1);
    await this.redis.del('dm:ban');

    for await (const banCase of banData) {
      const data: banData = JSON.parse(banCase);
      const dmChannelID = await this.client.getDMChannel(data.id);
      dmChannelID.createMessage(renderUserBan(data.type, data.reason, data.days));
    }

    const plural = banData.length > 1;
    const resultString = `**${banData.length}** ban message${plural ? 's' : ''
      } ${plural ? 'were' : 'was'} sent out.`;

    log(resultString);
  }

  start(context: context): void {
    log(`[INFO] Started Dm Users task.`);
    super.start(context);
  }
}
