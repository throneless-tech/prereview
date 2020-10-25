import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Unique,
} from '@mikro-orm/core';
import GroupModel from '../groups.ts';
import User from './user.ts';

@Entity()
export default class Group {
  [EntityRepositoryType]: GroupModel;

  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  @Unique()
  name!: string;

  @ManyToMany()
  members = new Collection<User>(this);

  constructor(name: string) {
    this.name = name;
  }
}
