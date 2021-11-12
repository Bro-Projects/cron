import type { Giveaway } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Giveaways extends GenericTable<Giveaway> {
  public async getActive() {
    const giveaways = await this.find({
      ended: false,
      forCron: true,
    });
    return giveaways;
  }

  public async addEntry(id: Giveaway['_id'], userID: string) {
    return this.update(id, {
      $push: { participants: { $each: [userID] } },
    });
  }

  public async getParticipants(id: Giveaway['_id']): Promise<string[]> {
    const participants = await this.get(id).then((r) => r.participants);
    return participants;
  }

  public async add(data: Giveaway) {
    return this.collection.insertOne({ data });
  }

  public async end(id: string) {
    return this.set(id, 'ended', true);
  }
}
