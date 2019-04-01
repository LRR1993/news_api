const connection = require('../db/connection');

exports.getArticles = ({
  sort_by: criteria = 'created_at',
  order = 'desc',
  ...remainingQueries
}) =>
  connection
    .select('*')
    .from('articles')
    .where(remainingQueries)
    .returning('*')
    .orderBy(criteria, order)
    .then(articles => {
      if (articles.length < 1)
        return Promise.reject({
          status: 404,
          msg: `Author: '${remainingQueries.author}' Not Found`
        });
      return articles;
    });
