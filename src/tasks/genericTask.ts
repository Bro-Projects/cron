import cron from 'node-cron';
import { context } from '../typings';

interface IGenericTask {
  interval: string;
  task: () => void;
  start(context: context): void;
}

export default abstract class GenericTask implements IGenericTask {
  interval: string;  

  task(): any {
    throw new Error('Task not implemented yet!');
  }

  start(context: context): void {
    cron.schedule(this.interval, this.task.bind(context)).start();
  }
}
