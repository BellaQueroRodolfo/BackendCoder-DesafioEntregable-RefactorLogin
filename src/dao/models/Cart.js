const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  productQuantities: [Number],
});

module.exports = mongoose.model('Cart', cartSchema);
