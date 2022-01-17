import type { UserExtraDB } from '../../../typings';
import { GenericTable } from './GenericTable';

export default class UserExtras extends GenericTable<UserExtraDB> {
  public async getAllSwordItems(): Promise<any> {
    const allSwItems = this.collection
      .aggregate([
        {
          $project: {
            'swordData.shards': 1,
            'swordData.tip': 1,
            'swordData.hilt': 1,
            'swordData.blade': 1,
            _id: 0
          }
        },
        {
          $addFields: {
            sData: {
              $objectToArray: '$swordData'
            }
          }
        },
        {
          $unwind: {
            path: '$sData'
          }
        },
        {
          $group: {
            _id: '$sData.k',
            v: {
              $sum: '$sData.v'
            }
          }
        },
        {
          $group: {
            _id: null,
            data: {
              $push: {
                k: '$_id',
                v: '$v'
              }
            }
          }
        },
        {
          $project: {
            data: {
              $arrayToObject: '$data'
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: '$data'
          }
        }
      ])
      .toArray();
    return allSwItems;
  }
}
