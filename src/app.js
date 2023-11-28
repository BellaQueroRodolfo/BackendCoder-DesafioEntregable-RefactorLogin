const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const app = express();
const port = 8080;

app.use(express.json());
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'src', 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
  extname: '.handlebars',
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const authRouter = require('./src/routes/auth');
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/auth', authRouter);
app.get('/chat', (req, res) => {
  res.render('chat', { layout: 'main' });
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
