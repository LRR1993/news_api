const connection = require('../db/connection');

exports.getUsers = id => {
  return connection
    .select('*')
    .from('users')
    .where(id)
    .first()
    .returning('*')
    .then(user => {
      return user;
    });
};
