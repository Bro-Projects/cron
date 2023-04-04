import axios from 'axios';
import { Item, MonthlyItem } from '@assets/items';

export default class ItemsApi {
  // hehe yes :D what u gonna do about it?
  static url = 'http://localhost:8532';

  public static async getItems(): Promise<Record<string, Item>> {
    const response = await axios.get<Record<string, Item>>(this.url + '/items');
    return response.data;
  }

  public static async getItem(id: string): Promise<Item> {
    const response = await axios.get<Item>(this.url + `/items/${id}`);
    return response.data;
  }

  public static async getItemIds(): Promise<string[]> {
    const response = await axios.get<string[]>(this.url + '/itemIds');
    return response.data;
  }

  public static async getMonthlyItem(): Promise<MonthlyItem> {
    const response = await axios.get<MonthlyItem>(this.url + '/monthlyItem');
    return response.data;
  }
}
