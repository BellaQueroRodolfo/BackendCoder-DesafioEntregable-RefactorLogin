const express = require('express');
const router = express.Router();
const { UserDAOFactory, ProductDAOFactory } = require('../../dao/factory');
const { PremiumUserDAO } = require('../../dao/userDAO');

router.get('/', async (req, res) => {
  try {
    const userDAO = UserDAOFactory.getUserDAO('default');
    const users = await userDAO.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const userDAO = UserDAOFactory.getUserDAO('default');
    const user = await userDAO.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userDAO = UserDAOFactory.getUserDAO('default');
    const newUser = await userDAO.createUser(username, password, role);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:uid', async (req, res) => {
  const userId = req.params.uid;
  const { username, password, role } = req.body;
  try {
    const userDAO = UserDAOFactory.getUserDAO('default');
    const updatedUser = await userDAO.updateUser(userId, username, password, role);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ user: updatedUser });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const userDAO = UserDAOFactory.getUserDAO('default');
    const deletedUser = await userDAO.deleteUser(userId);
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ user: deletedUser });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/premium/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const userDAO = UserDAOFactory.getUserDAO('premium');
    const updatedUser = await userDAO.updateUserRole(userId, 'premium');

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ user: updatedUser });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
