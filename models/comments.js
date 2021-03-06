const connection = require('../db/connection');

exports.deleteCommentEntry = id => {
  return connection('comments')
    .where(id)
    .del()
    .then(info => {
      if (!info)
        return Promise.reject({
          status: 404,
          msg: `Comment id: '${id.comment_id}' Not Found`
        });
    });
};

exports.updateCommentEntry = (prop, id) => {
  return connection('comments')
    .where(id)
    .increment('votes', prop.inc_votes)
    .returning('*')
    .then(votes => {
      const [updatedProp] = votes;
      if (!updatedProp)
        return Promise.reject({
          status: 404,
          msg: `Comment: '${id.comment_id}' Not Found`
        });
      return updatedProp;
    });
};
