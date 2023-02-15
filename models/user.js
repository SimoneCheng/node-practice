const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiration: Date,
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
