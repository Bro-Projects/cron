import type { context } from '@typings';
import type { CommandInteraction } from 'discord.js';

type Handler = (
  this: context,
  interaction: CommandInteraction
) => Promise<void> | void;

export default Handler;
