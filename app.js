const express = require('express');
const apiRouter = require('./routes/api-router');
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handlePsqlErrors
} = require('./errors');

const app = express();

app.use(express.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500);

module.exports = app;
