exports.up = function(knex, Promise) {
  console.log('creating comments table ...');
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable.foreign('author').references('users.username');
    commentsTable.foreign('article_id').references('articles.article_id');
    commentsTable.interger('votes').defaultTo(0);
    commentsTable.date('created_at');
    commentsTable.text('body');
  });
};

exports.down = function(knex, Promise) {
  console.log('removing comments table ...');
  return knex.schema.dropTable('comments');
};
