const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
  constructor(userName, email) {
    this.username = userName;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('user').insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('user').findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;