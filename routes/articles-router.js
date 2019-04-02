const articlesRouter = require('express').Router();
const {
  sendArticles,
  sendArticleById,
  updateArticle
} = require('../controllers/articles');

articlesRouter.route('/').get(sendArticles);
articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle);

module.exports = articlesRouter 
