export default () => ({
  env: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  graphql: {
    schema: 'schema.gql',
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: '1 day',
  },
});
