const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics');
const { methodNotAllowed } = require('../errors');

topicsRouter
  .route('/')
  .get(sendAllTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
