exports.timestampFormat = data => {
  const newData = [];
  data.forEach(item => {
    const { created_at, ...remaining } = item;
    let newtime = new Date(item.created_at).toISOString();
    newData.push({ created_at: newtime, ...remaining });
  });
  return newData;
};

exports.authorFormat = data => {
  const newData = [];
  data.forEach(item => {
    const { created_by, ...remaining } = item;
    newData.push({ author: item.created_by, ...remaining });
  });
  return newData;
};

exports.commentRef = articlesData => {
  const comments = {};
  articlesData.forEach(comment => {
    comments[comment.title] = comment.article_id;
  });
  return comments;
};
exports.articleFormat = (articlesLookup, data) => {
  const newData = [];
  data.forEach(comment => {
    const { belongs_to, ...remaining } = comment;
    newData.push({ article_id: articlesLookup[belongs_to], ...remaining });
  });
  return newData;
};
