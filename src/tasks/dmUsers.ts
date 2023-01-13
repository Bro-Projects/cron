import { renderUserBan } from '@renderers';
import type { BanData, context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class DmUsersTask extends GenericTask {
  interval = '*/5 * * * *';

  async task(this: context): Promise<void> {
    const banData = await this.redis.lrange('dm:ban', 0, -1);
    if (!banData.length) return null;

    await this.redis.del('dm:ban');

    for await (const banCase of banData) {
      const data: BanData = JSON.parse(banCase);
      const dmChannelID = await this.client.getDMChannel(data.id);
      await dmChannelID.createMessage(
        renderUserBan(data.type, data.reason, data.days)
      );
    }

    const plural = banData.length > 1;
    const resultString = `**${banData.length}** ban message${
      plural ? 's' : ''
    } ${plural ? 'were' : 'was'} sent out.`;

    log(resultString);
  }

  start(context: context): void {
    log(`[INFO] Started Dm Users task.`);
    super.start(context);
  }
}
