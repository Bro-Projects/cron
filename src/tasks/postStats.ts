import type { context } from '@typings';
import { log } from '@utils';
import axios from 'axios';
import GenericTask from './genericTask';

export default class PostStatsTask extends GenericTask {
  interval = '*/30 * * * *';

  async task(this: context): Promise<null> {
    const stats = await this.db.stats.getStats();

    if (!stats) {
      return null;
    }

    await axios.post(
      'https://top.gg/api/bots/543624467398524935/stats',
      { server_count: stats.guilds },
      { headers: { Authorization: this.config.keys.topgg } }
    );

    log(`[INFO] Posted stats with guild count ${stats.guilds}`);
    return null;
  }

  start(context: context): void {
    log(`[INFO] Started stats posting task.`);
    super.start(context);
  }
}
