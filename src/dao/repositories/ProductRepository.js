const { ProductDAO } = require('../models/ProductDAO');

class ProductRepository {
  async getAllProducts() {
    try {
      const products = await ProductDAO.find();
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await ProductDAO.findById(productId);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      const newProduct = new ProductDAO(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductRepository();
