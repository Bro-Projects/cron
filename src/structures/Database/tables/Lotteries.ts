import type { LotteryDB, LotteryResults, LotteryTypes } from '@typings';
import { GenericTable } from './GenericTable';

export default class Lotteries extends GenericTable<LotteryDB> {
  private constants = {
    hourly: 100_000,
    daily: 500_000,
    weekly: 5_000_000
  };

  public async join(userID: string, lotteryType: LotteryTypes) {
    await this.set(userID, lotteryType, 1);
  }

  public async reset(lotteryType: LotteryTypes) {
    return this.collection.updateMany(
      { [lotteryType]: 1 },
      { $set: { [lotteryType]: 0 } }
    );
  }

  public async getStats(lotteryType: LotteryTypes): Promise<LotteryResults> {
    const winner = await this.collection
      .aggregate([{ $match: { [lotteryType]: 1 } }, { $sample: { size: 1 } }])
      .toArray();

    if (!winner.length || !winner[0]._id) {
      return null;
    }
    const participantCount = await this.collection.countDocuments({
      [lotteryType]: 1
    });
    const amount = participantCount * this.constants[lotteryType];
    return {
      winnerID: winner[0]._id,
      amountWon: amount,
      participants: participantCount
    };
  }
}
