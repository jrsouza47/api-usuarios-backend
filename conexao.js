const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './banco.sqlite'  // <- isso não funciona no Railway
  },
  useNullAsDefault: true
});

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'knex_migrations',
  },
  ssl: { rejectUnauthorized: false }, // importante para Railway
});

module.exports = db;
