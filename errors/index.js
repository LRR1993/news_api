exports.routeNotFound = (req, res) => {
  res.status(404).json({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).json({ msg: 'Method Not Allowed' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).json({ msg: err.msg });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).json({ msg: 'Internal Server Error' });
};
