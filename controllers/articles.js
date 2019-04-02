const {
  getArticles,
  updateArticleProp,
  deleteArticleProp
} = require('../models/articles');

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

exports.updateArticle = (req, res, next) => {
  updateArticleProp(req.body, req.params)
    .then(article => {
      res.status(201).json({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  deleteArticleProp(req.params)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
