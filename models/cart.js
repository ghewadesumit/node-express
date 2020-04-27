const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(filePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + parseFloat(productPrice);
      // console.log(`current carrt is ${JSON.stringify(cart)}`);
      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    console.log("called from product js after delete");
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = JSON.parse(fileContent);
      console.log(`file content after reading the file is ${updatedCart}`);
      const product = updatedCart.products.find((prod) => prod.id == id);
      console.log(`product is`, product);
      if (!product) return;

      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      console.log(`updated cart is ${updatedCart}`);
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      if (updatedCart.totalPrice == 0) {
        updatedCart.products = [];
      }
      fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCartProducts(cb) {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) cb(null);
      else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
};
