const usersRouter = require('express').Router();
const { sendUsers, sendUser, addUser } = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .get(sendUsers)
  .post(addUser)
  .all(methodNotAllowed);

usersRouter
  .route('/:username')
  .get(sendUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
