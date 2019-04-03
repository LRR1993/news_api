const {
  articlesData,
  commentsData,
  topicsData,
  usersData,
} = require('../data');

const {
  timestampFormat,
  commentRef,
  authorFormat,
  commentFormat,
} = require('../../utils/utils');

exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(topicsData)
        .returning('*');
    })
    .then(() => {
      return knex('users')
        .insert(usersData)
        .returning('*');
    })
    .then(() => {
      const formatedArticles = timestampFormat(articlesData);
      return knex('articles')
        .insert(formatedArticles)
        .returning('*');
    })
    .then(insertedArticles => {
      const authorUpdated = authorFormat(commentsData);
      const timeUpdated = timestampFormat(authorUpdated);
      const articlelookup = commentRef(insertedArticles);
      const formattedComments = commentFormat(articlelookup, timeUpdated);
      return knex('comments')
        .insert(formattedComments)
        .returning('*');
    });
};
