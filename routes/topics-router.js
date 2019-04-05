const topicsRouter = require('express').Router();
const { sendAllTopics, addTopic } = require('../controllers/topics');
const { methodNotAllowed } = require('../errors');

topicsRouter
  .route('/')
  .get(sendAllTopics)
  .post(addTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
