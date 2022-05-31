export default () => ({
  env: {
    port: parseInt(process.env.ENV_PORT, 10) || 3000,
    isDev: process.env.NODE_ENV === 'development',
  },
  graphql: {
    schema: 'schema.gql',
  },
  database: {
    url: process.env.DATABASE_URL,
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
