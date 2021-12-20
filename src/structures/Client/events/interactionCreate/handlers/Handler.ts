import type { CommandInteraction } from 'eris';
import type { context } from '../../../../../typings';

type Handler = (
  ctx: context,
  interaction: CommandInteraction,
) => Promise<any | void> | void;

export default Handler;
