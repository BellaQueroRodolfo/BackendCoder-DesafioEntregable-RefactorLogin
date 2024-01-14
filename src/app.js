const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const mockingModule = require('./src/mockingModule'); 
const customErrorDictionary = require('./src/customErrorDictionary'); 
const { UserDAO } = require('./src/dao/factory'); 
const bcrypt = require('bcrypt');

const app = express();
const port = 8080;

mongoose.connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserDAO.findByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: 'your-github-client-id',
      clientSecret: 'your-github-client-secret',
      callbackURL: 'http://localhost:8080/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserDAO.findByUsername(profile.username);
        if (!existingUser) {
          const newUser = {
            username: profile.username,
            password: 'generated-password',
            role: 'user',
          };
          await UserDAO.createUser(newUser);
        }
        const user = await UserDAO.findByUsername(profile.username);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserDAO.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
