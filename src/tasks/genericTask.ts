import Sentry from '@structs/Sentry';
import type { context } from '@typings';
import cron from 'node-cron';

interface IGenericTask {
  interval: string;
  task: () => void;
  start(context: context): void;
  setInterval(str: string): void;
}

export default abstract class GenericTask implements IGenericTask {
  interval: string;
  name: string;

  task(): any {
    throw new Error('Task not implemented yet!');
  }

  start(context: context): void {
    const checkInId = Sentry.captureCheckIn(
      {
        monitorSlug: this.name,
        status: 'in_progress',
      },
      {
        schedule: {
          type: 'crontab',
          value: this.interval,
        }
      }
    );

    cron.schedule(
      this.interval,
      async () => {
        try {
          await this.task.call(context)
          Sentry.captureCheckIn({
            checkInId,
            monitorSlug: this.name,
            status: 'ok',
          });

        } catch (error) {
          console.error(error);
          Sentry.captureCheckIn({
            checkInId,
            monitorSlug: this.name,
            status: 'error',
          });
          Sentry.captureException(error);
        }
      }
    ).start();
  }

  setInterval(str: string) {
    this.interval = str;
  }
}
