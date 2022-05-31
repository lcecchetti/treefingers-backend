import { Options } from '@mikro-orm/core';

const MikroOrmConfig: Options = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  debug: true,
};

export default MikroOrmConfig;
