const connection = require('../db/connection');

exports.getArticles = ({
  sort_by: criteria = 'articles.created_at',
  order = 'desc',
  limit = 10,
  p = 1,
  article_id,
  ...remainingQueries
}) => {
  const sortingArr = [
    'article_id',
    'title',
    'body',
    'votes',
    'topic',
    'author',
    'created_at'
  ];
  if (!sortingArr.includes(criteria)) criteria = 'articles.created_at';
  if (isNaN(limit) || limit < 0) limit = 10;
  if (isNaN(p) || p < 0) p = 1;
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  const articlesQ = connection
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
    .limit(limit)
    .offset(limit * (p - 1))
    .returning('*');

  const counted = connection('articles')
    .count('article_id as total_count')
    .modify(query => {
      if (remainingQueries.author) {
        query.where('articles.author', '=', remainingQueries.author);
      } else if (article_id) {
        query.where('articles.article_id', '=', article_id);
      } else {
        query.where(remainingQueries);
      }
    });
  return Promise.all([articlesQ, counted]).then(result => {
    const [articles, [count]] = result;
    if (!articles)
      return Promise.reject({
        status: 404,
        msg: `User: '${article_id}' Not Found`
      });
    if (!Array.isArray(articles)) {
      return articles;
    }
    const newArticle = { articles, total_count: count.total_count };
    return newArticle;
  });
};

exports.updateArticleProp = (prop, id) => {
  return connection('articles')
    .where(id)
    .increment('votes', prop.inc_votes)
    .returning('*')
    .then(votes => {
      const [updatedProp] = votes;
      if (!updatedProp)
        return Promise.reject({
          status: 404,
          msg: `Article: '${id.article_id}' Not Found`
        });
      return updatedProp;
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
    limit = 10,
    p = 1,
    ...remainingQueries
  },
  id
) => {
  const sortingArr = [
    'comment_id',
    'author',
    'article_id',
    'created_at',
    'body',
    'votes'
  ];
  if (!sortingArr.includes(criteria)) criteria = 'comments.created_at';
  if (order !== 'desc' && order !== 'asc') order = 'desc';
  if (isNaN(limit) || limit < 0) limit = 10;
  if (isNaN(p) || p < 0) p = 1;
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
    .limit(limit)
    .offset(limit * (p - 1))
    .returning('*');
};

exports.makeComment = ({ username, ...remainingBody }, id) => {
  const formattedBody = {
    author: username,
    article_id: id.article_id,
    ...remainingBody
  };
  return connection('comments')
    .insert(formattedBody)
    .returning('*')
    .then(comment => {
      const [newComment] = comment;
      return newComment;
    });
};

exports.makeArticle = article => {
  return connection('articles')
    .insert(article)
    .returning('*')
    .then(insertedArticle => {
      const [newArticle] = insertedArticle;
      return newArticle;
    });
};
