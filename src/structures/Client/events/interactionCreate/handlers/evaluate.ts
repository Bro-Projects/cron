import { codeblock, escapeRegex } from '../../../../../utils';
import { inspect } from 'util';
import { loadConfig } from '../../../../../utils';
import { context } from '../../../../../typings';
import { CommandInteraction } from 'eris';

export async function evaluate(this: context, slash: CommandInteraction) {
  const config = loadConfig();

  if (!config.owners.includes(slash.member.id)) {
    return slash.reply({
      embeds: [
        {
          description: 'nice try'
        }
      ],
      ephemeral: true
    });
  }

  const credentialRegex = RegExp(
    Object.values(config.keys).map(escapeRegex).join('|'),
    'gi'
  );
  const args = slash.value.split(' ');
  const depthIdx = args.findIndex((arg) => arg.startsWith('--depth'));
  let depth = depthIdx === -1 ? 1 : +args.splice(depthIdx, 1)[0].split('=')[1];

  const input = args.join(' ');
  const asynchr = input.match(/(await|return)/g);
  let res: string | Error;
  try {
    const ctx = this;
    res = await eval(asynchr ? `(async () => { ${input} })()` : input);
  } catch (err) {
    res = err;
  }

  let output: string;
  if (typeof res === 'string') {
    output = res;
  } else {
    do {
      output = inspect(res, { depth: depth-- });
    } while (depth >= 0 && output.length > 1950);
  }

  if (output.length > 1950) {
    output = output.slice(0, 1950) + ' ...';
  }

  return slash.reply({
    embeds: [
      {
        title: 'Eval Output',
        description: codeblock(output || '\n').replace(credentialRegex, 'no'),
        color: 0x2f3136,
        timestamp: new Date()
      }
    ]
    // ephemeral: true,
  });
}
