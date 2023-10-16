import type { context } from '@typings';
import { VoteSite, renderVoteReminderEmbed } from '@renderers';
import { log, randomColour } from '@utils';
import GenericTask from './genericTask';

export default class RemindersTask extends GenericTask {
  interval = '*/5 * * * *'; // every 5th minute

  async task(this: context): Promise<void> {
    const { hookID, token } = this.config.webhooks.reminders;

    const reminders = await this.db.reminders.getAllExpired('vote');
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
        let dmSent = true;
        await this.db.reminders.del(reminder._id);
        const user = await this.client.getRESTUser(reminder.userID);
        const renderResult = renderVoteReminderEmbed(
          user,
          (reminder.message as VoteSite) ?? 'topgg'
        );
        const userInfo = `${user.username}#${user.discriminator} (${user.mention})`;

        try {
          await this.client.dm(reminder.userID, renderResult);
        } catch (err) {
          dmSent = false;
          log(`[ERROR] Error when sending vote reminder DM: ${err.message}`);
        }

        this.client.sendWebhookMessage(hookID, token, {
          embeds: [
            {
              title: 'Vote Reminder',
              description:
                dmSent === true
                  ? `Vote reminder DM successfully sent to ${userInfo}`
                  : `Vote reminder DM to ${userInfo} has failed.`,
              timestamp: new Date().toISOString()
            }
          ]
        });
      }, reminder.expiresAt - Date.now());
    }
    const plural = reminders.length > 1;
    const resultString = `**${reminders.length}** reminder${
      plural ? 's' : ''
    } ${plural ? 'were' : 'was'} scheduled to be sent out.`;

    await this.client.sendWebhookMessage(hookID, token, {
      embeds: [
        {
          title: 'Vote Reminder Task',
          description: resultString,
          timestamp: new Date().toISOString(),
          color: randomColour()
        }
      ]
    });
    return log(resultString);
  }

  start(context: context): void {
    log(`[INFO] Started vote reminder task.`);
    super.start(context);
  }
}
