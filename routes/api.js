const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { getToApi } = require('../controllers/api');
const topicsRouter = require('../routes/topics');

apiRouter
  .route('/')
  .get(getToApi)
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
