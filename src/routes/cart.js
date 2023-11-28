const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/Cart');

router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json({ carts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json({ cart });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      cart.products.push(productId);
      await cart.save();
      res.json({ cart });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      const productIndex = cart.products.indexOf(productId);
      if (productIndex === -1) {
        res.status(404).json({ error: 'Product not found in cart' });
      } else {
        cart.productQuantities[productIndex] = quantity;
        await cart.save();
        res.json({ cart });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
