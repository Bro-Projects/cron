import { MongoClient, Db } from 'mongodb';
import Giveaways from '../Database/tables/Giveaways';
import Users from '../Database/tables/Users';
import Banks from '../Database/tables/Banks';
import Lotteries from './tables/Lotteries';

export default class Database {
  private db: Db;

  public giveaways: Giveaways;
  public users: Users;
  public banks: Banks;
  public lotteries: Lotteries;

  public async bootstrap(
    mongoURI = 'mongodb://localhost/conversion',
  ): Promise<void> {
    const dbConn = await MongoClient.connect(mongoURI);
    this.db = dbConn.db();
    this.users = new Users(this.db.collection('users'));
    this.banks = new Banks(this.db.collection('banks'));
    this.giveaways = new Giveaways(this.db.collection('giveaways'));
    this.lotteries = new Lotteries(this.db.collection('lotteries'));
  }

  public async addLotteryWin(userID: string, coins: number) {
    await this.banks.inc(userID, 'pocket', coins);
    return this.users.update(userID, {
      $inc: {
        ['totalStats.lotteryWins']: 1,
        ['items.lotteryticket']: 1,
      },
    });
  }
}
