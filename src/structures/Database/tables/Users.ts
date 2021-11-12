import type { UserDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Users extends GenericTable<UserDB> {
  public async updateItemAmount(
    userID: string,
    itemID: string,
    amount: number,
  ) {
    const { items } = await this.get(userID);
    items[itemID] = Math.max((items[itemID] || 0) + amount, 0);

    if (items[itemID] === 0) {
      this.unset(userID, `items.${itemID}`);
    }
    return this.inc(userID, `items.${itemID}`, amount);
  }
}
