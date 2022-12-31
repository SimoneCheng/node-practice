const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
  constructor(userName, email, cart, id) {
    this.username = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('user').insertOne(this);
  }

  addToCart(product) {
    let newQuantity = 1;
    let cartProductIndex;
    let updatedCartItems;
    try {
      updatedCartItems = [...this.cart.items];
      cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
    } catch {
      cartProductIndex = -1;
      updatedCartItems = [];
    }
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ 
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection('user')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart }}
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => i.productId);
    return db
      .collection('product')
      .find({ _id: { $in: productIds }})
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity,
          }
        })
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('user').findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;