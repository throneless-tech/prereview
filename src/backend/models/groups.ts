import { EntityRepository, MikroORM, Repository } from '@mikro-orm/core';
import orcidUtils from 'orcid-utils';
import { validate as uuidValidate } from 'uuid';
import { Group } from './entities';
import { User } from './entities';
import { getLogger } from '../log.js';

const log = getLogger('backend:models:groups');

@Repository(Group)
export class GroupModel extends EntityRepository<Group> {
  async isMemberOf(groupName: string, userId: string): Promise<boolean> {
    const group = await this.findOne({ name: groupName }, ['members']);
    if (!group) {
      log.warn(`No such group ${groupName}`);
      return false;
    }

    let user: any;

    if (orcidUtils.isValid(userId)) {
      user = await this.em.findOne(User, { orcid: userId as string });
    } else if (uuidValidate(userId)) {
      user = await this.em.findOne(User, { uuid: userId as string });
    }

    if (!user) return false;
    return group.members.contains(user);
  }
}

export function groupModelWrapper(db: MikroORM): GroupModel {
  return db.em.getRepository(Group);
}
