const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const mockingModule = require('./src/mockingModule');
const customErrorDictionary = require('./src/customErrorDictionary');
const { getLogger } = require('./src/logger');
const { UserDAO, PremiumUserDAO } = require('./src/dao/factory');
const UserDTO = require('./src/dao/dto/UserDTO');
const { PremiumUserDTO } = require('./src/dao/dto/PremiumUserDTO');

const logger = getLogger();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

db.once('open', () => {
  logger.info('Connected to MongoDB');
});

passport.use(
  new LocalStrategy((username, password, done) => {
    UserDAO.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: 'your-github-client-id',
      clientSecret: 'your-github-client-secret',
      callbackURL: 'http://localhost:8080/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      UserDAO.findOne({ username: profile.username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          const newUser = new UserDAO({
            username: profile.username,
            password: 'generated-password',
            role: 'user',
          });
          newUser.save((err, savedUser) => {
            if (err) {
              return done(err);
            }
            return done(null, savedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserDAO.findById(id, (err, user) => {
    done(err, user);
  });
});

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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/mockingproducts', (req, res) => {
  const mockedProducts = mockingModule.generateMockProducts();
  res.json(mockedProducts);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = customErrorDictionary[err.type] || 'Internal Server Error';
  logger.error(`Error: ${message}`);
  res.status(status).json({ error: message });
});

const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

const userRouter = require('./src/routes/user');
app.use('/api/users', userRouter);

const productRouter = require('./src/routes/product');
app.use('/api/products', productRouter);

const cartRouter = require('./src/routes/cart');
app.use('/api/carts', cartRouter);

const ticketRouter = require('./src/routes/ticket');
app.use('/api/tickets', ticketRouter);

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
