const express = require('express');
const router = express.Router();
const Product = require('../dao/models/Product');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ product });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const newProduct = new Product({ title, description, price });
    await newProduct.save();
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
