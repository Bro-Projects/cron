import type { context } from '../typings';
import { log } from '../utils';
import GenericTask from './genericTask';

export default class RoleRemovalTask extends GenericTask {
  interval = '*/5 * * * *'; // every 5th minute

  async task(this: context): Promise<void> {
    const reminders = await this.db.reminders.getAllRoleRemovals();
    if (!reminders.length) {
      return null;
    }

    for (const reminder of reminders) {
      if (this.reminders.has(reminder.userID)) {
        return null;
      }
      this.reminders.set(`reminder.userID-${reminder.type}`, reminder);
      setTimeout(async () => {
        this.reminders.delete(reminder.userID);
        await this.db.reminders.del(reminder._id);

        this.client
          .removeGuildMemberRole('773897905496916021', reminder.userID, '932462333459062816')
          .then(() => {
            log(`[INFO] Removed role from user: ${reminder.userID}`);
          })
          .catch((error) => {
            console.error(error);
          });
      }, reminder.expiresAt - Date.now());
    }
  }

  start(context: context): void {
    log(`[INFO] Started role removal reminder task.`);
    super.start(context);
  }
}
