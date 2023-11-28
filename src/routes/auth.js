const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { layout: 'main' });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  User.register(new User({ email }), password, (err, user) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.redirect('/auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/products');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('login', { layout: 'main' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/auth/login',
}), (req, res) => {});
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;
