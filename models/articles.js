const connection = require('../db/connection');

exports.getArticles = ({
  sort_by: criteria = 'articles.created_at',
  order = 'desc',
  article_id,
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
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .count('comments.article_id AS comment_count')
    .groupBy('articles.article_id')
    .modify(query => {
      if (remainingQueries.author) {
        query.where('articles.author', '=', remainingQueries.author);
      } else if (article_id) {
        query.where('articles.article_id', '=', article_id).first();
      } else {
        query.where(remainingQueries);
      }
    })
    .orderBy(criteria, order)
    .returning('*')
    .then(articles => {
      if (!articles)
        return Promise.reject({
          status: 404,
          msg: `User: '${article_id}' Not Found`
        });
      if (articles.length < 1) {
        let errName = remainingQueries.author;
        if (remainingQueries.topic) errName = remainingQueries.topic;
        return Promise.reject({
          status: 400,
          msg: `Bad Request: '${errName}' Not Found`
        });
      }
      if (Array.isArray(articles)) {
        articles.forEach(article => {
          article.comment_count = +article.comment_count;
        });
      } else {
        articles.comment_count = +articles.comment_count;
      }
      return articles;
    });
};

exports.updateArticleProp = (prop, id) => {
  return connection('articles')
    .where(id)
    .increment('votes', prop.inc_votes)
    .returning('*')
    .then(votes => {
      if (!prop.inc_votes)
        return Promise.reject({
          status: 400,
          msg: `Bad Request: malformed body / missing required fields`
        });
      return votes;
    });
};

exports.deleteArticleProp = id => {
  return connection('articles')
    .where(id)
    .del()
    .then(info => {
      if (!info)
        return Promise.reject({
          status: 404,
          msg: `User: '${id.article_id}' Not Found`
        });
    });
};

exports.getComments = (
  {
    sort_by: criteria = 'comments.created_at',
    order = 'desc',
    ...remainingQueries
  },
  id
) => {
  return connection
    .select(
      'comments.author',
      'comments.body',
      'comments.created_at',
      'comments.votes',
      'comment_id',
      'comments.body'
    )
    .from('comments')
    .leftJoin('articles', 'comments.article_id', '=', 'articles.article_id')
    .modify(query => {
      if (id) {
        query.where('articles.article_id', '=', id.article_id);
      } else {
        query.where(remainingQueries);
      }
    })
    .orderBy(criteria, order)
    .returning('*')
    .then(comments => {
      return comments;
    });
};
