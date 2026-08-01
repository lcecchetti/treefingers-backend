// See mikro-orm-core.ts. Reimplements the token-naming behavior of the real
// @mikro-orm/nestjs so `getRepositoryToken(Entity)` still works to provide
// mocked repositories in `Test.createTestingModule`.
import { Inject } from '@nestjs/common';

function className(entity: unknown): string {
  return typeof entity === 'string'
    ? entity
    : (entity as { name: string }).name;
}

export function getRepositoryToken(entity: unknown, name?: string): string {
  const suffix = name ? `_${name}` : '';
  return `${className(entity)}Repository${suffix}`;
}

export const InjectRepository = (entity: unknown, name?: string) =>
  Inject(getRepositoryToken(entity, name));
