const { getUser, getUsers, makeUser } = require('../models/users');

exports.sendUser = (req, res, next) => {
  getUser(req.params)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(next);
};
exports.sendUsers = (req, res, next) => {
  getUsers()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(next);
};

exports.addUser = (req, res, next) => {
  makeUser(req.body)
    .then(user => {
      res.status(201).json({ user });
    })
    .catch(next);
};
