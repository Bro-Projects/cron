// import type { context, JSONData } from '../typings';
// import { Collection } from 'eris';
// import { log } from '../utils';
// import items from '../../assets/items';
// import GenericTask from './genericTask';

// export default class CurrencyStatsTask extends GenericTask {
//   interval = '*/5 * * * *'; // '5 */6 * * *' at the 5th minute of every 6th hour

//   async task(this: context): Promise<void> {
//     const data = new Collection(String);
//     const users = await this.db.getAllUsers();

//     for await (const user of users) {
//       if (user.pocket > 0) data.increment('pocket', user.pocket);
//       if (user.bank > 0) data.increment('bank', user.bank);

//       for (const item of Object.keys(items)) {
//         if (user.items?.[item] > 0) {
//           data.increment(item, user.items[item]);
//           data.increment(
//             'invWorth',
//             Number((items[item].price / 4) * user.items[item]),
//           );
//         }
//       }
//     }

//     const json: JSONData = {
//       time: Date.now(),
//     };
//     for (const [key, value] of data.entries()) {
//       json[key] = value;
//     }

//     await this.redis.set('bro-cstats', JSON.stringify(json));
//     log('[INFO] Successfully calculated and stored cstats.');
//   }

//   async start(context: context): Promise<void> {
//     log('[INFO] Started currency stats task eval.');
//     super.start(context);
//     const res = await context.redis.exists('bro-cstats');
//     if (!res) {
//       await this.task.call(context);
//     }
//   }
// }
