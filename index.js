/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const glob = require('glob');
const config = require('./config');
const errorController = require('./controllers/errorController');

const app = express();

app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static('public'));

glob.sync('./routes/**/*.js').forEach((file) => {
  require(path.resolve(file))(app);
});

app.use(errorController.notFound);
app.use(errorController.error);

app.listen(config.server.port || 3000);
