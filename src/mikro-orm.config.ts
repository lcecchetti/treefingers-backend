import { Options } from '@mikro-orm/core';

const MikroOrmConfig: Options = {
  entitiesTs: ['./src/**/*.entity.ts'],
  entities: ['./dist/**/*.entity.js'],
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: { ssl: process.env.NODE_ENV !== 'development' },
  },
  migrations: {
    pathTs: 'src/migrations',
    path: 'dist/migrations',
    disableForeignKeys: false,
  },
  debug: true,
};

export default MikroOrmConfig;
