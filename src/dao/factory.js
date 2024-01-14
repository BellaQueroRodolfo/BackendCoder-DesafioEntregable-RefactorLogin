const ProductDAO = require('./models/ProductDAO');
const CartDAO = require('./models/CartDAO');
const UserDAO = require('./models/UserDAO');

function dbFactory() {
  return { ProductDAO, CartDAO, UserDAO };
}

module.exports = dbFactory;
