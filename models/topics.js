const connection = require('../db/connection');

exports.getTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .returning('*');
};

exports.makeTopic = topic => {
  return connection('topics')
    .insert(topic)
    .returning('*')
    .then(insertedTopic => {
      const [newTopic] = insertedTopic;
      return newTopic;
    });
};
