import { Item, MonthlyItem } from '@assets/items';
import axios from 'axios';

enum Endpoint {
  ITEMS = '/items',
  ITEM_IDS = '/itemIds',
  MONTHLY_ITEM = '/monthlyItem'
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8532'
});

type ApiResponse<T> = Promise<T>;

async function request<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export default class ItemsApi {
  public static getItems(): ApiResponse<Record<string, Item>> {
    return request<Record<string, Item>>(Endpoint.ITEMS);
  }

  public static getItem(id: string): ApiResponse<Item> {
    return request<Item>(`${Endpoint.ITEMS}/${id}`);
  }

  public static getItemIds(): ApiResponse<Item['id'][]> {
    return request<string[]>(Endpoint.ITEM_IDS);
  }

  public static getMonthlyItem(): ApiResponse<MonthlyItem> {
    return request<MonthlyItem>(Endpoint.MONTHLY_ITEM);
  }
}
