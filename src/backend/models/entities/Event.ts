import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Fixture } from 'class-fixtures-factory';
import { EventModel } from '../events';
import { BaseEntity } from './BaseEntity';
import { Community } from './Community';

@Entity()
export class Event extends BaseEntity {
  //eslint-disable-next-line
  [EntityRepositoryType]?: EventModel;

  @Fixture(faker => `${faker.commerce.color()} ${faker.random.word()}`)
  @Property()
  title!: string;

  @Fixture(() => new Date())
  @Property()
  start!: Date;

  //eslint-disable-next-line
  @Property()
  isPrivate: boolean = false;

  @Fixture(faker => faker.lorem.sentences())
  @Property({ columnType: 'text', nullable: true })
  description?: string;

  @ManyToOne({ entity: () => Community, nullable: true })
  community?: Community;

  constructor(
    title: string,
    start: Date,
    isPrivate = false,
    description?: string,
    community?: Community,
  ) {
    super();
    this.title = title;
    this.start = start;
    this.isPrivate = isPrivate;
    this.description = description;
    this.community = community;
  }
}
