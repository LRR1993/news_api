const connection = require('../db/connection');

exports.getUser = id => {
  return connection
    .select('*')
    .from('users')
    .where(id)
    .first()
    .returning('*')
    .then(user => {
      if (!user && !isNaN(id.username))
        return Promise.reject({
          status: 400,
          msg: `Bad Request: '${id.username}' invalid input`
        });
      if (!user)
        return Promise.reject({
          status: 404,
          msg: `User: '${id.username}' Not Found`
        });
      return user;
    });
};

exports.getUsers = () => {
  return connection
    .select('*')
    .from('users')
    .returning('*');
};

exports.makeUser = user => {
  return connection('users')
    .insert(user)
    .returning('*')
    .then(insertedUser => {
      const [newUser] = insertedUser;
      return newUser;
    });
};
