import type { Collection, DeleteResult, UpdateResult } from 'mongodb';
import type { GenericEntity } from '../../../typings';

export class GenericTable<Entity extends GenericEntity> {
  public collection: Collection;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  protected get(_id: any) {
    return this.collection.findOne({ _id });
  }

  protected getAll() {
    return this.find({});
  }

  protected find(query: object = {}) {
    return this.collection
      .find({
        ...query,
      })
      .toArray();
  }

  protected update(_id: any, query: Object): Promise<UpdateResult> {
    return this.collection.updateOne({ _id }, { ...query }, { upsert: true });
  }

  protected del(_id: any): Promise<DeleteResult> {
    return this.collection.deleteOne({ _id });
  }

  protected set(
    _id: string,
    field: string,
    value: string | number | boolean,
  ): Promise<UpdateResult> {
    return this.update(_id, {
      $set: {
        [field]: value,
      },
    });
  }

  protected unset(_id: string, field: string) {
    return this.update(_id, {
      $unset: { [field]: 0 },
    });
  }

  protected inc(_id: string, field: string, amount = 1): Promise<UpdateResult> {
    return this.update(_id, {
      $inc: {
        [field]: amount,
      },
    });
  }
}
