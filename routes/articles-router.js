const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);
articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = articlesRouter;
