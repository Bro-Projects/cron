import { renderCmdUsage } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class PostCmdUsageTask extends GenericTask {
  interval = '0 * * * *';
  name = 'postCmdUsage';

  async task(this: context): Promise<void> {
    const { hookID, token } = this.config.webhooks.cmdUsage;
    const cmdUsage = await this.redis.hgetall('cmdUsage');
    await this.client.executeWebhook(hookID, token, renderCmdUsage(cmdUsage));
    await this.redis.del('cmdUsage');
    log('[INFO] Successfully calculated cmd usage and posted.');
  }

  async start(context: context): Promise<void> {
    log('[INFO] Started cmd usage calculation task.');
    super.start(context);
  }
}