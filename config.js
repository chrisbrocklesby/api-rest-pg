module.exports = {
  enviroment: 'development',
  server: {
    port: 3000,
  },
  database: {
    host: 'localhost',
    name: 'api-test',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
  },
  jwt: {
    expires: '10s',
    accessKey: 'JWTk3yP4sSw0rd1',
    refreshKey: 'JWTk3yP4sSw0rd2',
  },
};
