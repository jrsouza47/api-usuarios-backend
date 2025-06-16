require('dotenv').config();

module.exports = {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: './migrations'
    }
  }
};
