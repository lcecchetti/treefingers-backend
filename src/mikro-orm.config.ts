// MikroORM v6's CLI no longer auto-loads .env into process.env (only
// MIKRO_ORM_*-prefixed vars are propagated), so load it ourselves here for
// the CLI-driven commands (migration:check, migration:up, etc). The Nest
// app itself doesn't use this file — it gets its config via ConfigModule.
import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

export default defineConfig({
  entitiesTs: ['./src/**/*.entity.ts'],
  entities: ['./dist/**/*.entity.js'],
  clientUrl: process.env.DATABASE_URL,
  // v7 no longer infers property types by default (no more ts-morph source
  // parsing); ReflectMetadataProvider restores type inference from TS's
  // emitted design:type metadata, matching this project's entities, which
  // rely on it for most scalar/PK properties.
  metadataProvider: ReflectMetadataProvider,
  driverOptions: {
    ssl: process.env.NODE_ENV !== 'development',
  },
  // v7 no longer infers `updateRule: 'cascade'` for ordinary relations (only
  // for composite-PK/FK-as-PK/pivot cases); the live schema has `on update
  // cascade` on every FK from pre-v7 behavior, so restore it as the default
  // to keep this a pure library bump with no schema drift.
  schemaGenerator: {
    defaultUpdateRule: 'cascade',
  },
  extensions: [Migrator],
  migrations: {
    pathTs: 'src/migrations',
    path: 'dist/migrations',
    disableForeignKeys: false,
  },
  debug: true,
});
