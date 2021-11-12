import type {
  Collection,
  DeleteWriteOpResultObject,
  UpdateWriteOpResult,
} from 'mongodb';
import type { GenericEntity } from '../../../typings';

export class GenericTable<Entity extends GenericEntity> {
  public collection: Collection;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  protected get(_id: Entity['_id']): Promise<Entity> {
    return this.collection.findOne({ _id });
  }

  protected getAll(): Promise<Entity[]> {
    return this.find({});
  }

  protected find(query: object = {}): Promise<Entity[]> {
    return this.collection
      .find({
        ...query,
      })
      .toArray();
  }

  protected update(_id: string, query: Object): Promise<UpdateWriteOpResult> {
    return this.collection.updateOne({ _id }, { ...query }, { upsert: true });
  }

  protected del(_id: string): Promise<DeleteWriteOpResultObject> {
    return this.collection.deleteOne({ _id });
  }

  protected set(
    _id: string,
    field: string,
    value: string | number | boolean,
  ): Promise<UpdateWriteOpResult> {
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

  protected inc(
    _id: string,
    field: string,
    amount = 1,
  ): Promise<UpdateWriteOpResult> {
    return this.update(_id, {
      $inc: {
        [field]: amount,
      },
    });
  }
}
