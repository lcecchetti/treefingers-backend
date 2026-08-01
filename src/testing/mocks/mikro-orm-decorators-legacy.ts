// See mikro-orm-core.ts: stubs out MikroORM's (ESM-only) decorators for unit
// tests. Every decorator here is a no-op — entities just need to be
// definable, not actually mapped to a schema.
const noopDecoratorFactory = () => () => {};

module.exports = new Proxy(
  {},
  {
    get: () => noopDecoratorFactory,
  },
);
