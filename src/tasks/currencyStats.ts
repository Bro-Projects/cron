import type { context, JSONData } from '@typings';
import { log, BroCollection } from '@utils';
import items from '@assets/items';
import GenericTask from './genericTask';
import { renderCurrencyStatsEmbed } from '@renderers';

export default class CurrencyStatsTask extends GenericTask {
  interval = '5 */6 * * *'; // at the 5th minute of every 6th hour

  async task(this: context): Promise<void> {
    const data = new BroCollection(String);
    const [[totalCoins], [totalItems], [totalSwordItems]] = await Promise.all([
      await this.db.banks.getCoinValues(),
      await this.db.users.getAllItems(),
      await this.db.userExtras.getAllSwordItems()
    ]);

    data.set('pocket', totalCoins.pocket.toString());
    data.set('bank', totalCoins.bank.toString());
    for (const [itemID, amount] of Object.entries(totalItems)) {
      data.set(itemID, amount.toString());
      data.increment(
        'inventory',
        Number((amount * items[itemID]?.price ?? 0) / 4) ?? 0
      );
    }

    for (const [itemID, amount] of Object.entries(totalSwordItems)) {
      data.set(itemID, amount.toString());
    }

    const json: JSONData = {
      time: Date.now()
    };
    for (const [key, value] of data.entries()) {
      json[key] = value;
    }

    // log currency stats
    const oldStats = await this.redis.get('bro-cstats');
    const newStats = JSON.stringify(json);
    const { hookID, token } = this.config.webhooks.stats;

    const renderedEmbeds = await renderCurrencyStatsEmbed(oldStats, newStats);
    await this.client.executeWebhook(hookID, token, renderedEmbeds);

    await this.redis.set('bro-cstats', newStats);
    log('[INFO] Successfully calculated and stored currency stats.');
  }

  async start(context: context): Promise<void> {
    log('[INFO] Started currency stats task eval.');
    super.start(context);
    const res = await context.redis.exists('bro-cstats');
    if (!res) {
      await this.task.call(context);
    }
  }
}
