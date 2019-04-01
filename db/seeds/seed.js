const {
  articlesData,
  commentsData,
  topicsData,
  usersData
} = require('../data');

const { timestampFormat } = require('../../utils/utils');

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
      const userInserted = knex('users')
        .insert(usersData)
        .returning('*');
      return Promise.all([topicRows, userInserted]);
    })
    .then(() => {
      const formatedArticles = timestampFormat(articlesData);
      console.log(formatedArticles);
      // return knex('articles')
      //   .insert(formatedArticles)
      //   .returning('*');
    });
};
