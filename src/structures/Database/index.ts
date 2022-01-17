import { MongoClient, Db } from 'mongodb';
import Giveaways from './tables/Giveaways';
import Users from './tables/Users';
import Banks from './tables/Banks';
import Lotteries from './tables/Lotteries';
import UserExtras from './tables/UserExtras';
import Reminders from './tables/Reminders';

export default class Database {
  private db: Db;

  public giveaways: Giveaways;
  public users: Users;
  public banks: Banks;
  public lotteries: Lotteries;
  public reminders: Reminders;
  public userExtras: UserExtras;

  public async bootstrap(mongoURI: string): Promise<void> {
    const dbConn = await MongoClient.connect(mongoURI);
    this.db = dbConn.db();
    this.users = new Users(this.db.collection('users'));
    this.banks = new Banks(this.db.collection('banks'));
    this.giveaways = new Giveaways(this.db.collection('giveaways'));
    this.lotteries = new Lotteries(this.db.collection('lotteries'));
    this.reminders = new Reminders(this.db.collection('reminders'));
    this.userExtras = new UserExtras(this.db.collection('userExtras'));
  }

  public async addLotteryWin(userID: string, coins: number) {
    await this.banks.inc(userID, 'pocket', coins);
    return this.users.update(userID, {
      $inc: {
        ['totalStats.lotteryWins']: 1,
        ['items.lotteryticket']: 1
      }
    });
  }
}
