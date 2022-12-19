const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('product').updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('product').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('product')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err)
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('product')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => {
        console.log(err)
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
    .collection('product')
    .deleteOne({ _id: new mongodb.ObjectId(productId) })
    .then(result => {
      console.log('deleted!');
    })
    .catch(err => {
      console.log(err);
    });
  }
}

module.exports = Product;