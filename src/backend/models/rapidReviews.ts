import { EntityRepository, MikroORM, Repository } from '@mikro-orm/core';
import RapidReview from './entities/rapidReview.ts';

@Repository(RapidReview)
class RapidReviewModel extends EntityRepository<RapidReview> {}

const rapidReviewModelWrapper = (db: MikroORM): RapidReviewModel =>
  db.em.getRepository(RapidReview);

export default rapidReviewModelWrapper;
