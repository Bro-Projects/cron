import type { BankDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Users extends GenericTable<BankDB> {
  public addPocket(userID: string, amount: number) {
    return this.inc(userID, 'pocket', amount);
  }

  async removePocket(userID: string, amount: number) {
    const { pocket } = (await this.get(userID)) as any;
    return this.inc(userID, 'pocket', -Math.min(pocket, amount));
  }
}
