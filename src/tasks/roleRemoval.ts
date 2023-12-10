import type { context } from '@typings';
import { log } from '@utils';
import GenericTask from './genericTask';

export default class RoleRemovalTask extends GenericTask {
  interval = '*/5 * * * *'; // every 5th minute
  name = 'roleRemoval';

  async task(this: context): Promise<void> {
    const reminders = await this.db.reminders.getAllExpired('role-removal');
    if (!reminders.length) {
      return null;
    }

    for (const reminder of reminders) {
      const mapString = `${reminder.type}-${reminder.userID}`;
      if (this.reminders.has(mapString)) {
        return null;
      }
      this.reminders.set(mapString, reminder);
      setTimeout(async () => {
        this.reminders.delete(mapString);
        await this.db.reminders.del(reminder._id);
        const [guildID, botVoterRoleID] = [
          '773897905496916021',
          '932462333459062816'
        ];

        try {
          await this.client.removeGuildMemberRole(
            guildID,
            reminder.userID,
            botVoterRoleID
          );
          log(`[INFO] Removed role from user: ${reminder.userID}`);
        } catch (err) {
          let output: unknown;

          if (err instanceof Error) {
            output = err.message;
          } else {
            output = err;
          }

          log(
            `[ERROR] Member role removal failed for ${reminder.userID}: ${output}`
          );
        }
      }, reminder.expiresAt - Date.now());
    }
  }

  start(context: context): void {
    log(`[INFO] Started role removal reminder task.`);
    super.start(context);
  }
}
