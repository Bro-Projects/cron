import type { CommandInteraction } from 'eris';
import type { context } from '../../../../../typings';

type Handler = (
  this: context,
  interaction: CommandInteraction,
) => Promise<void> | void;

export default Handler;
