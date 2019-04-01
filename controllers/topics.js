const { getTopics } = require('../models/topics');

exports.sendAllTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).json({ topics });
    })
    .catch(next);
};
