const {
  articlesData,
  commentsData,
  topicsData,
  usersData
} = require('../data');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      knex('topics')
        .insert(topicsData)
        .returning('*');
    })
    .then(topicRows => {
      const usersInserted = knex('users')
        .insert(usersData)
        .returning('*');
      return Promise.all([topicRows, usersInserted]);
    });
};
