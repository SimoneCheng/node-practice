const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      if (existingProduct) {
        existingProduct.qty = existingProduct.qty + 1;
      } else {
        let updatedProduct;
        updatedProduct = { id: id, qty: 1 };
        cart.products = [ ...cart.products, updatedProduct ];
      }
      cart.totalPrice = Number(cart.totalPrice) + Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
        if (err) return;
        const updatedCart = JSON.parse(fileContent);
        const product = updatedCart.products.find((product) => product.id === id);
        if (!product) return;
        const productQty = product.qty;
        updatedCart.products = updatedCart.products.filter((product) => product.id !== id); 
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
        fs.writeFile(p, JSON.stringify(updatedCart), (err) => console.log(err));
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
