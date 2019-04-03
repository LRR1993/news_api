exports.getToApi = (req, res) =>
  res.json({
    topics: 'shows a list of topics',
    articles: {
      id: 'shows a specfic article',
      article_id: {
        coments: 'show or add new a new comment for an article'
      }
    },
    comments: 'update or delete a specfic comment relation to an article',
    users: 'shows all users'
  });
