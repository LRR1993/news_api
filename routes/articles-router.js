const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticle,
  deleteArticle,
  sendCommentsById
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

articlesRouter.route('/:article_id/comments').get(sendCommentsById);

module.exports = articlesRouter;
