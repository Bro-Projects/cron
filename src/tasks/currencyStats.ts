import type { context, JSONData } from '../typings';
import { Collection } from 'eris';
import { log } from '../utils';
import items from '../../assets/items';
import GenericTask from './genericTask';

export default class CurrencyStatsTask extends GenericTask {
  interval = '5 */6 * * *'; // at the 5th minute of every 6th hour

  async task(this: context): Promise<void> {
    const data = new Collection(String);
    const [[totalCoins], [totalItems], [totalSwordItems]] = await Promise.all([
      await this.db.banks.getCoinValues(),
      await this.db.users.getAllItems(),
      await this.db.userExtras.getAllSwordItems()
    ]);

    data.set('pocket', totalCoins.pocket);
    data.set('bank', totalCoins.bank);
    for (const [itemID, amount] of Object.entries(totalItems)) {
      data.set(itemID, amount as string);
      data.increment(
        'inventory',
        Number(((amount as number) * items[itemID].price) / 4),
      );
    }

    for (const [itemID, amount] of Object.entries(totalSwordItems)) {
      data.set(itemID, amount as string);
    }

    const json: JSONData = {
      time: Date.now(),
    };
    for (const [key, value] of data.entries()) {
      json[key] = value;
    }

    await this.redis.set('bro-cstats', JSON.stringify(json));
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
