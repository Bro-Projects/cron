import type { context, IGenericTask } from '../typings';
import cron from 'node-cron';

export default abstract class GenericTask implements IGenericTask {
  interval: string;

  task(): any {
    throw new Error('Task not implemented yet!');
  }

  start(context: context): void {
    cron.schedule(this.interval, this.task.bind(context)).start();
  }
}
