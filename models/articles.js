const connection = require('../db/connection');

exports.getArticles = ({
  sort_by: criteria = 'created_at',
  order = 'desc',
  ...remainingQueries
}) => {
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  return connection
    .select(
      'articles.title',
      'articles.topic',
      'articles.author',
      'articles.body',
      'articles.created_at',
      'articles.votes',
      'articles.article_id'
    )
    .from('articles')
    .join('comments', 'comments.article_id', '=', 'articles.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id')
    .where(query => {
      if (remainingQueries.author) {
        query.where('articles.author', '=', remainingQueries.author);
      } else {
        query.where(remainingQueries);
      }
    })
    .orderBy(criteria, order)
    .returning('*')
    .then(articles => {
      if (articles.length < 1) {
        let errName = remainingQueries.author;
        if (remainingQueries.topic) errName = remainingQueries.topic;
        return Promise.reject({
          status: 400,
          msg: `Bad Request: '${errName}' Not Found`
        });
      }
      articles.forEach(article => {
        article.comment_count = +article.comment_count;
      });
      return articles;
    });
};
