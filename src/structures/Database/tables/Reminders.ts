import type { ReminderDB } from '@typings';
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

  public async getAllExpired(
    type: ReminderDB['type'],
    ms = 60000
  ) {
    const reminders = await this.find({
      type,
      expiresAt: { $exists: true, $lte: Date.now() - ms }
    });
    return reminders;
  }
}
