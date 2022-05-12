export default () => ({
  env: {
    port: parseInt(process.env.ENV_PORT, 10) || 3000,
    isDev: process.env.NODE_ENV === 'development',
  },
  graphql: {
    schema: 'schema.gql',
  },
  database: {
    uri: process.env.MONGODB_URI,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: '1 day',
  },
  frontend: {
    webUrl: process.env.FRONTEND_WEBURL,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
});
