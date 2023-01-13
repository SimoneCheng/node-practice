const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
      }
    }]
  }
});

userSchema.methods.addToCart = function (product) {
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
      productId:product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = { items: this.cart.items.filter(item => item.productId.toString() !== productId.toString()) };
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../utils/database').getDb;

// class User {
//   constructor(userName, email, cart, id) {
//     this.username = userName;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('user').insertOne(this);
//   }

//   addToCart(product) {
//     let newQuantity = 1;
//     let cartProductIndex;
//     let updatedCartItems;
//     try {
//       updatedCartItems = [...this.cart.items];
//       cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
//     } catch {
//       cartProductIndex = -1;
//       updatedCartItems = [];
//     }
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();
//     return db
//       .collection('user')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);
//     return db
//       .collection('product')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(product => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity,
//           }
//         })
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = { items: this.cart.items.filter(item => item.productId.toString() !== productId.toString()) };
//     const db = getDb();
//     return db
//       .collection('user')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCartItems } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//             email: this.email
//           }
//         };
//         return db.collection('order').insertOne(order);
//       })
//       .then(reuslt => {
//         this.cart = { items: [] };
//         return db
//           .collection('user')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           )
//       })
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('order')
//       .find({'user._id': new mongodb.ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection('user').findOne({ _id: new mongodb.ObjectId(userId) });
//   }
// }

// module.exports = User;