import { Options } from '@mikro-orm/core';

const MikroOrmConfig: Options = {
  entitiesTs: ['./src/**/*.entity.ts'],
  entities: ['./dist/**/*.entity.js'],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  debug: true,
};

export default MikroOrmConfig;
