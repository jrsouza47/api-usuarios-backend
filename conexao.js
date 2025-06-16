const knex = require('knex');
const config = require('./knexfile');

const ambiente = process.env.NODE_ENV || 'production';
const dbConfig = config[ambiente];

if (!dbConfig) {
  console.error(`Configuração do ambiente "${ambiente}" não encontrada no knexfile.js`);
  process.exit(1);
}

const db = knex(dbConfig);

module.exports = db;
