import type { GiveawayDB } from '@typings';
import { GenericTable } from './GenericTable';

export default class Giveaways extends GenericTable<GiveawayDB> {
  public async getActive() {
    const giveaways = await this.find({
      ended: false,
      forCron: true
    });
    return giveaways;
  }

  public async addEntry(id: GiveawayDB['_id'], userID: string) {
    return this.update(id, {
      $push: { participants: { $each: [userID] } }
    });
  }

  public async getParticipants(
    id: GiveawayDB['_id']
  ): Promise<GiveawayDB['_id'][]> {
    const participants = await this.get(id).then((r) => r.participants);
    return participants;
  }

  public async end(id: string) {
    return this.set(id, 'ended', true);
  }
}
