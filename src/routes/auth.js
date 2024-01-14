const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { UserDAO } = require('../dao/factory');
const UserDTO = require('../dao/dto/UserDTO');

router.post('/login', passport.authenticate('local'), (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.status(200).json({ user: userDTO });
});

router.get('/profile', (req, res) => {
});

router.put('/update', (req, res) => {
});

module.exports = router;
