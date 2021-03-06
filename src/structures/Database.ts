import { R } from 'rethinkdb-ts';
import { LotteryResults } from '../utils';

export default class Database {
  private r: R;

  async connect(r: R): Promise<void> {
    this.r = r;
    await this.r.connectPool({});
  }

  async getLottery(): Promise<any[]> {
    return this.r.table('lottery').run();
  }

  async getLotteryStats(): Promise<LotteryResults | null> {
    const winner = await this.r.table('lottery').sample(1).run();
    if (winner.length === 0) {
      return null;
    }
    const participantCount = await this.r.table('lottery').count().run();
    const amount = participantCount * 2e6;
    return {
      winnerID: winner[0].id,
      amountWon: amount,
      participantsCount: participantCount
    };
  }

   getLotteryWins(userID: string): Promise<number> {
    return this.r.table('users').get(userID)('lotteryWins').run();
  }

  async resetLottery(): Promise<void> {
    await this.r.table('lottery').delete().run();
  }

  async addLotteryWin(userID: string, coins: number): Promise<void> {
    await this.r.table('users')
    .get(userID)
    .update({
      lotteryWins: this.r.row('lotteryWins').add(1),
      pocket: this.r.row('pocket').add(Number(coins)),
    })
    .run();
  }
}
