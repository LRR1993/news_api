const { getArticles } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
  getArticles(req.query)
    .then(articles => {
      res.status(200).json({ articles });
    })
    .catch(next);
};

exports.sendArticleById = (req, res, next) => {
  getArticles(req.params)
    .then(article => {
      res.status(200).json({ article });
    })
    .catch(next);
};
