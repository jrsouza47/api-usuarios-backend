const knex = require('knex');
const config = require('./knexfile');

const ambiente = process.env.NODE_ENV || 'development';
const conexao = knex(config[ambiente]);

module.exports = conexao;