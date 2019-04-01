const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { getToApi } = require('../controllers/api');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');

apiRouter
  .route('/')
  .get(getToApi)
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
