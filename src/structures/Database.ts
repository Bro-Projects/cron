import { R } from 'rethinkdb-ts';
import { LotteryResults } from '../utils';

export default class Database {
  private r: R;

  async connect(r: R): Promise<void> {
    this.r = r;
    await this.r.connectPool({});
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

  async addLotteryWin(userID: string, coins: number): Promise<void> {
    await this.r.table('users')
    .get(userID)
    .update({
      lotteryWins: this.r.row('lotteryWins').add(1),
      pocket: this.r.row('pocket').add(Number(coins)),
    })
    .run();
  }

  async resetLottery(): Promise<void> {
    await this.r.table('lottery').delete().run();
  }

  async getLotteryUsers(): Promise<string[] | null> {
    const userIDs = await this.r.table('lottery').run();
    if (!userIDs) {
      return null;
    }
    return userIDs.map((user) => user.id);
  }

  getLotteryWins(userID: string): Promise<number> {
    return this.r.table('users').get(userID)('lotteryWins').run();
  }

  getSettings(userID: string): Promise<boolean> {
    return this.r.table('users').get(userID)('dmsDisabled').run() || null;
  }
}
