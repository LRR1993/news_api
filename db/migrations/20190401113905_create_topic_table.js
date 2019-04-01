exports.up = function(knex, Promise) {
  console.log('creating topics table...');
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable
      .string('slug')
      .primary()
      .unique();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('removing houses topics...');
  return knex.schema.dropTable('houses');
};