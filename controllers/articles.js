const { getArticles } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
    .then(articles => {
      res.status(200).json({ articles });
    })
    .catch(next);
};
