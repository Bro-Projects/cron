import type { LotteryDB, LotteryTypes } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Lotteries extends GenericTable<LotteryDB> {
  public constants = {
    hourly: 250_000,
    daily: 1_000_000,
    weekly: 10_000_000,
  };

  public async join(userID: string, lotteryType: LotteryTypes) {
    await this.set(userID, lotteryType, 1);
  }

  public async reset(lotteryType: LotteryTypes) {
    return this.collection.findOneAndUpdate([lotteryType], {
      [lotteryType]: 0,
    });
  }

  public async getStats(lotteryType: LotteryTypes) {
    const winner = this.collection.aggregate([
      { $match: { [lotteryType]: 1 } },
      { $sample: { size: 1 } },
    ]);

    if (!winner) {
      return null;
    }
    const participantCount = await this.collection.countDocuments({
      [lotteryType]: 1,
    });
    const amount = participantCount * this.constants[lotteryType];
    return {
      winnerID: winner[0]._id,
      amountWon: amount,
      participants: participantCount,
    };
  }
}
