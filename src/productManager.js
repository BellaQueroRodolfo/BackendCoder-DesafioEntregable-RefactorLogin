const fs = require('fs').promises;

class ProductManager {
  constructor(productsFilePath, cartsFilePath) {
    this.productsFilePath = productsFilePath;
    this.cartsFilePath = cartsFilePath;
  }

  async getPlantProducts() {
    try {
      const data = await fs.readFile(this.productsFilePath, 'utf8');
      const products = JSON.parse(data);
      return products.slice(0, 4);
    } catch (error) {
      throw error;
    }
  }

  async getPlantProductById(productId) {
    try {
      const data = await fs.readFile(this.productsFilePath, 'utf8');
      const products = JSON.parse(data);
      const plantProduct = products.find((product) => product.id === parseInt(productId));
      return plantProduct;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductManager;
