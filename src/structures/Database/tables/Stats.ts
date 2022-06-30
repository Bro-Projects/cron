import type { StatsDB } from '@typings';
import { GenericTable } from './GenericTable';

export default class Stats extends GenericTable<StatsDB> {
  async getStats() {
    const data = await this.get(1);
    return data?.stats ?? null;
  }
}
