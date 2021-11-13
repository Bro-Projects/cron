import type { UserDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Users extends GenericTable<UserDB> {
  public async updateItemAmount(
    userID: string,
    itemID: string,
    amount: number,
  ) {
    const { items } = await this.get(userID);
    items[itemID] = Math.max((items[itemID] || 0) + amount, 0);

    if (items[itemID] === 0) {
      this.unset(userID, `items.${itemID}`);
    }
    return this.inc(userID, `items.${itemID}`, amount);
  }

  public async updateCooldown(userID: string, lotteryType: string) {
    await this.set(
      userID,
      `personalCooldowns.${lotteryType}Lottery`,
      Date.now(),
    );
  }

  public async addLotteryWin(userID: string, coins: number) {
    await this.update(userID, {
      $inc: {
        ['pocket']: coins,
        ['totalStats.LotteryWins']: 1,
        ['items.lotteryticket']: 1,
      },
    });
  }

  public async addWeeklyWin(userID: string, coins: number) {
    return this.update(userID, {
      $inc: {
        ['totalStats.LotteryWins']: 1,
        ['items.lotteryticket']: 1,
        ['upgrades.coupon']: coins,
      },
    });
  }

  public async getLotteryWins(userID: string) {
    return this.get(userID).then((u) => u.totalStats.lotteryWins);
  }
}
