const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 8080;
const dbFactory = require('./src/dao/factory');

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

const { ProductDAO, CartDAO, UserDAO } = dbFactory();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
