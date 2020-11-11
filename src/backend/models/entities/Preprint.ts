import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Fixture } from 'class-fixtures-factory';
import { PreprintModel } from '../preprints';
import { BaseEntity } from './BaseEntity';
import { Community } from './Community';
import { Comment } from './Comment';
import { FullReview } from './FullReview';
import { RapidReview } from './RapidReview';
import { Request } from './Request';
import { Tag } from './Tag';

@Entity()
export class Preprint extends BaseEntity {
  //eslint-disable-next-line
  [EntityRepositoryType]?: PreprintModel;

  @Property()
  title!: string;

  @Property()
  uuid!: string;

  @Property()
  url!: string;

  @OneToMany({ entity: () => RapidReview, mappedBy: 'preprint' })
  rapidReviews: Collection<RapidReview> = new Collection<RapidReview>(this);

  @OneToMany({ entity: () => FullReview, mappedBy: 'preprint' })
  fullReviews: Collection<FullReview> = new Collection<FullReview>(this);

  @OneToMany({ entity: () => Request, mappedBy: 'preprint' })
  requests: Collection<Request> = new Collection<Request>(this);

  @ManyToMany({ entity: () => Community, mappedBy: 'preprints' })
  communities: Collection<Community> = new Collection<Community>(this);

  @ManyToMany({ entity: () => Tag, mappedBy: 'preprints' })
  tags: Collection<Tag> = new Collection<Tag>(this);

  @OneToMany({ entity: () => Comment, mappedBy: 'parent' })
  comments: Collection<Comment> = new Collection<Comment>(this);

  constructor(title: string, uuid: string, url: string) {
    super();
    this.title = title;
    this.uuid = uuid;
    this.url = url;
  }
}