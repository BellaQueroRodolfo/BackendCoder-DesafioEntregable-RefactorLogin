const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const mockingModule = require('./src/mockingModule');
const customErrorDictionary = require('./src/customErrorDictionary');
const winston = require('winston');
const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const developmentLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

const productionLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./src/routes/auth');

app.use('/auth', authRouter);
app.get('/mockingproducts', (req, res) => {
  const mockedProducts = mockingModule.generateMockProducts();
  res.json(mockedProducts);
});
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = customErrorDictionary[err.type] || 'Internal Server Error';
  logger.error(`[${status}] ${message}`);
  
  res.status(status).json({ error: message });
});

app.get('/loggerTest', (req, res) => {
  logger.debug('This is a debug message');
  logger.http('This is an http message');
  logger.info('This is an info message');
  logger.warning('This is a warning message');
  logger.error('This is an error message');
  logger.fatal('This is a fatal message');

  res.send('Logger test complete. Check the console or log files.');
});

module.exports = app;
