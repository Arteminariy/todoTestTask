require('dotenv').config();

module.exports = () => {
  return {
    development: {
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
    },
    test: {
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
    },
    production: {
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
    },
  };
};
