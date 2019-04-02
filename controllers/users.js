const { getUsers } = require('../models/users');

exports.sendUsers = (req, res, next) => {
  getUsers(req.params)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(next);
};
