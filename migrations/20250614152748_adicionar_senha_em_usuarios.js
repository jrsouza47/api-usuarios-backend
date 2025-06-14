exports.up = function(knex) {
  return knex.schema.alterTable('usuarios', function(table) {
    table.string('senha').notNullable().defaultTo('senha_temporaria');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('usuarios', function(table) {
    table.dropColumn('senha');
  });
};
