const express = require('express');
const router = express.Router();
const productRepository = require('../dao/repositories/ProductRepository');

router.get('/', async (req, res) => {
  try {
    const products = await productRepository.getAllProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json({ product });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
