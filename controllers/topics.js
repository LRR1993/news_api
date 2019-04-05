const { getTopics, makeTopic } = require('../models/topics');

exports.sendAllTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  makeTopic(req.body)
    .then(topic => {
      res.status(201).json({ topic });
    })
    .catch(next);
};
