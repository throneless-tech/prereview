import { FixtureFactory } from '@mikro-resources/fixtures';
import { MikroORM } from '@mikro-orm/core';
import { Preprint } from '../models/entities';
import config from '../mikro-orm.config';

async function main() {
  try {
    const orm = await MikroORM.init(config);
    const factory = new FixtureFactory(orm, { logging: true, maxDepth: 4 });

    // Generate and persist
    const result = factory.make(Preprint);
    await result.oneAndPersist();
    await orm.close();
    return;
  } catch (err) {
    console.error('Failed to run seeds:', err);
  }
}

main();
