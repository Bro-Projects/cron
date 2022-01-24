import type { ReminderDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class Reminders extends GenericTable<ReminderDB> {
  public async addReminder(data: ReminderDB) {
    return this.add({
      dmID: data.dmID,
      type: data.type,
      userID: data.userID,
      expiresAt: data.expiresAt,
      message: data.message ?? null
    });
  }

  public async getAllExpired(ms = 60000): Promise<ReminderDB[]> {
    const reminders = await this.find({
      type: 'vote',
      expiresAt: { $exists: true, $lte: Date.now() - ms }
    });
    return reminders as unknown as ReminderDB[];
  }

  public async getAllRoleRemovals(ms = 60000): Promise<ReminderDB[]> {
    const reminders = await this.find({
      type: 'role-removal',
      expiresAt: { $exists: true, $lte: Date.now() - ms }
    });
    return reminders as unknown as ReminderDB[];
  }

}
