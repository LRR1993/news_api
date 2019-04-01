exports.up = function(knex, Promise) {
  console.log('creating articles table ...');
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id');
    articlesTable.string('title');
    articlesTable.text('body');
    articlesTable.interger('votes').defaultTo(0);
    articlesTable.foreign('topic').references('topics.slug');
    articlesTable.foreign('author').references('users.username');
    articlesTable.date('created_at');
  });
};

exports.down = function(knex, Promise) {
  console.log('removing articles table...');
  return knex.schema.dropTable('articles');
};
