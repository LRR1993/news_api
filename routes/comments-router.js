const commentsRouter = require('express').Router();
const {
  deleteCommentById,
  updateCommentById,
} = require('../controllers/comments');
const { methodNotAllowed } = require('../errors');

commentsRouter
  .route('/:comment_id')
  .delete(deleteCommentById)
  .patch(updateCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
