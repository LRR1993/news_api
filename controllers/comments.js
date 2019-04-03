const {
  deleteCommentEntry,
  updateCommentEntry,
} = require('../models/comments');

exports.deleteCommentById = (req, res, next) => {
  deleteCommentEntry(req.params)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};

exports.updateCommentById = (req, res, next) => {
  updateCommentEntry(req.body, req.params)
    .then(comment => {
      res.status(201).json({ comment });
    })
    .catch(next);
};
