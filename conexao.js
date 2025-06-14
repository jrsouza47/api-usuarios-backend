const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './banco.sqlite'  // <- isso não funciona no Railway
  },
  useNullAsDefault: true
});
