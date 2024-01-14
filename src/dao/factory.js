const { PremiumUserDAO, UserDAO } = require('./dao');

const getDAO = (type) => {
  if (type === 'premium') {
    return new PremiumUserDAO();
  } else {
    return new UserDAO();
  }
};

module.exports = { getDAO };
