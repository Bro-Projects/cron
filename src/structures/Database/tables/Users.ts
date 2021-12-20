import type { UserDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Users extends GenericTable<UserDB> {
  public async updateItemAmount(userID: string, itemID: string, amount = 1) {
    const { items } = await this.get(userID);
    items[itemID] = Math.max((items[itemID] || 0) + amount, 0);

    if (items[itemID] === 0) {
      this.unset(userID, `items.${itemID}`);
    }
    return this.inc(userID, `items.${itemID}`, amount);
  }

  public async updateCooldown(userID: string, lotteryType: string) {
    return this.set(
      userID,
      `personalCooldowns.${lotteryType}Lottery`,
      Date.now(),
    );
  }

  public async addWeeklyWin(userID: string, coins: number) {
    return this.update(userID, {
      $inc: {
        ['totalStats.lotteryWins']: 1,
        ['items.lotteryticket']: 1,
        ['items.coupon']: 1,
        ['upgrades.coupon']: coins,
      },
    });
  }

  public async getLotteryWins(userID: string): Promise<number> {
    return this.get(userID).then((u) => u.totalStats.lotteryWins) ?? 0;
  }

  public async getAllItems() {
    const res = this.collection
      .aggregate([
        {
          $group: {
            _id: null,
            allItems: { $mergeObjects: '$items' },
          },
        },
        { $replaceRoot: { newRoot: '$allItems' } },
      ])
      .toArray();
    return res;
  }
}
