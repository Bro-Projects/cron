import { MongoClient, Db } from 'mongodb';
import Giveaways from '../Database/tables/Giveaways';
import Users from '../Database/tables/Users';
import Banks from '../Database/tables/Banks';

export default class Database {
  private db: Db;

  public giveaways: Giveaways;
  public users: Users;
  public banks: Banks;

  public async bootstrap(mongoURI: string): Promise<void> {
    const dbConn = await MongoClient.connect(mongoURI, {
      useUnifiedTopology: true,
    });
    this.db = dbConn.db();
    this.users = new Users(this.db.collection('users'));
    this.banks = new Banks(this.db.collection('banks'));
    this.giveaways = new Giveaways(this.db.collection('tickets'));
  }
}
