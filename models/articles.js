const connection = require('../db/connection');

exports.getArticles = ({
  sort_by: criteria = 'created_at',
  order = 'desc',
  ...remainingQueries
}) => {
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  return connection
    .select('*')
    .from('articles')
    .where(remainingQueries)
    .returning('*')
    .orderBy(criteria, order)
    .then(articles => {
      if (articles.length < 1) {
        let errName = remainingQueries.author;
        if (remainingQueries.topic) errName = remainingQueries.topic;
        return Promise.reject({
          status: 400,
          msg: `Bad Request: '${errName}' Not Found`
        });
      }
      return articles;
    });
};
