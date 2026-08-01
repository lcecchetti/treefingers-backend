// Lightweight stand-in for @mikro-orm/core in unit tests: MikroORM 7 ships
// pure ESM, which ts-jest/CommonJS can't require. Unit tests never exercise
// real ORM behavior (repositories/query builders are mocked per test), so a
// stub with the handful of runtime symbols actually used is enough.

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept only so `new Collection<Entity>()` call sites still type-check
export class Collection<T> {
  constructor(...args: unknown[]) {
    void args;
  }
}

export function wrap<T extends object>(entity: T) {
  return {
    assign: (data: Partial<T>) => Object.assign(entity, data),
    init: async () => entity,
  };
}

export function raw(sql: string) {
  return {
    toString: () => sql,
    valueOf: () => sql,
  };
}
