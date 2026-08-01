// See mikro-orm-core.ts. EntityRepository/QueryBuilder are only referenced
// here because emitDecoratorMetadata forces TS to import a service's
// constructor-parameter types as runtime values; tests never instantiate
// these directly (they pass in jest mocks instead).
/* eslint-disable @typescript-eslint/no-unused-vars -- kept only so `EntityRepository<Entity>`/`QueryBuilder<Entity>` type positions still type-check */
export class EntityRepository<T> {}
export class QueryBuilder<T> {}
/* eslint-enable @typescript-eslint/no-unused-vars */
