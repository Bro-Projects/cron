import { renderCmdUsage } from '@renderers';
import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class Post24hCmdUsageTask extends GenericTask {
  interval = '0 0 * * *';

  async task(this: context): Promise<void> {
    const { hookID, token } = this.config.webhooks.cmdUsage;
    const cmdUsage = await this.redis.hgetall('24hcmdUsage');
    await this.client.executeWebhook(
      hookID,
      token,
      renderCmdUsage(cmdUsage, '24 hours', true)
    );
    await this.redis.del('24hcmdUsage');
    log('[INFO] Successfully calculated 24h cmd usage and posted.');
  }

  async start(context: context): Promise<void> {
    log('[INFO] Started 24h cmd usage calculation task.');
    super.start(context);
  }
}
