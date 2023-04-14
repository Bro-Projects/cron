import type { CommandInteraction } from 'discord.js';
import type { context } from '@typings';

type Handler = (
  this: context,
  interaction: CommandInteraction
) => Promise<void> | void;

export default Handler;
