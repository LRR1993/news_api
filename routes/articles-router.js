const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticle,
  deleteArticle,
  sendCommentsById,
  addComment,
} = require('../controllers/articles');

const { methodNotAllowed } = require('../errors');

articlesRouter
  .route('/')
  .get(sendArticles)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle)
  .delete(deleteArticle)
  .all(methodNotAllowed);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsById)
  .post(addComment)
  .all(methodNotAllowed);

module.exports = articlesRouter;
