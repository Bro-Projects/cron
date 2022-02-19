import type { BankDB } from '@typings';
import { GenericTable } from './GenericTable';

export default class Banks extends GenericTable<BankDB> {
  public addPocket(userID: string, amount: number) {
    return this.inc(userID, 'pocket', amount);
  }

  async removePocket(userID: string, amount: number) {
    const { pocket } = (await this.get(userID));
    return this.inc(userID, 'pocket', -Math.min(pocket, amount));
  }

  public async getCoinValues() {
    const total = await this.collection
      .aggregate<{ pocket: number, bank: number }>([
        {
          $group: {
            _id: null,
            pocket: { $sum: '$pocket' },
            bank: { $sum: '$bank' }
          }
        },
        { $project: { _id: 0 } }
      ])
      .toArray();
    return total;
  }
}
