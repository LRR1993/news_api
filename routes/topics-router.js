const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics');

topicsRouter.route('/').get(sendAllTopics);

module.exports = topicsRouter;
