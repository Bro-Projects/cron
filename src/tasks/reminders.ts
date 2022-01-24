import type { context } from '../typings';
import { renderVoteReminderEmbed } from '../renderers';
import { log, randomColour } from '../utils';
import GenericTask from './genericTask';

export default class RemindersTask extends GenericTask {
  interval = '*/5 * * * *'; // every 5th minute

  async task(this: context): Promise<void> {
    const { hookID, token } = this.config.webhooks.reminders;

    const reminders = await this.db.reminders.getAllExpired();
    if (!reminders.length) {
      return null;
    }

    for (const reminder of reminders) {
      if (this.reminders.has(reminder.userID)) {
        return null;
      }
      this.reminders.set(reminder.userID, reminder);
      setTimeout(async () => {
        this.reminders.delete(reminder.userID);
        let dmSent = true;
        await this.db.reminders.del(reminder._id);
        const user = await this.client.getRESTUser(reminder.userID);
        const renderResult = renderVoteReminderEmbed(user);
        const userInfo = `${user.tag} (${user.mention})`;

        try {
          await this.client.sendDM(user.id, renderResult);
        } catch (err) {
          dmSent = false;
          log(`[ERROR] Error when sending vote reminder DM: ${err.message}`);
        }

        this.client.executeWebhook(hookID, token, {
          embeds: [
            {
              title: 'Vote Reminder',
              description:
                dmSent === true
                  ? `Vote reminder DM successfully sent to ${userInfo}`
                  : `Vote reminder DM to ${userInfo} has failed.`,
              timestamp: new Date()
            }
          ]
        });
      }, reminder.expiresAt - Date.now());
    }
    const plural = reminders.length > 1;
    const resultString = `**${reminders.length}** reminder${
      plural ? 's' : ''
    } ${plural ? 'were' : 'was'} scheduled to be sent out.`;

    this.client.executeWebhook(hookID, token, {
      embeds: [
        {
          title: 'Reminder Task',
          description: resultString,
          timestamp: new Date(),
          color: randomColour()
        }
      ]
    });
    log(resultString);
  }

  start(context: context): void {
    log(`[INFO] Started vote reminder task.`);
    super.start(context);
  }
}
