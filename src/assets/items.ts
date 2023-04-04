import ItemsApi from '../utils/api/items';

export enum itemTypes {
  Utility,
  Upgrades,
  Collectable,
  yes,
  Useless,
  // Non-buyable
  Lifesaver,
  Findable,
  // Non-sellable
  Lottery,
  Redeemable,
  Antique,
  Event,
  Special,
  Exclusive,
  Extras,
  Holiday
}

const items: Record<string, MonthlyItem | Item> = {};

export default items;

export interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  type: itemTypes;
  hidden?: boolean;
  chances?: {
    beg: number;
    search: number;
    mine: number;
  };
}

export interface MonthlyItem extends Item {
  date: string;
  type: itemTypes.Special | itemTypes.Antique;
  endedEarly?: boolean;
}

export const loadItems = async () => {
  const responseOfItems = await ItemsApi.getItems();
  for (const [key, value] of Object.entries(responseOfItems)) {
    items[key] = value;
  }
};

export type itemNames = string;
