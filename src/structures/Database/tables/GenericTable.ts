import type { Collection, DeleteResult, UpdateResult } from 'mongodb';
import type { GenericEntity } from '@typings';

export class GenericTable<Entity extends GenericEntity> {
  public collection: Collection<Entity>;

  constructor(collection: Collection<Entity>) {
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
        ...query
      })
      .toArray();
  }

  public async add(entity: any): Promise<void> {
    await this.collection.insertOne(entity);
  }

  public update(
    _id: any,
    query: Record<string, unknown>
  ): Promise<UpdateResult> {
    return this.collection.updateOne({ _id }, { ...query }, { upsert: true });
  }

  public del(_id: any): Promise<DeleteResult> {
    return this.collection.deleteOne({ _id });
  }

  protected set(
    _id: string,
    field: string,
    value: string | number | boolean
  ): Promise<UpdateResult> {
    return this.update(_id, {
      $set: {
        [field]: value
      }
    });
  }

  protected unset(_id: string, field: string) {
    return this.update(_id, {
      $unset: { [field]: 0 }
    });
  }

  public inc(_id: string, field: string, amount = 1): Promise<UpdateResult> {
    return this.update(_id, {
      $inc: {
        [field]: amount
      }
    });
  }
}
