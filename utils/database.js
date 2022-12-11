require("dotenv").config();

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const DB_CONNECTION = `mongodb+srv://simone:${process.env.TOKEN}@cluster0.dbs3f3u.mongodb.net/shop?retryWrites=true&w=majority`;
let _db;

const mongoConnect = (callback) => {
  mongoClient.connect(DB_CONNECTION)
    .then(client => {
      console.log('connected!');
      _db = client.db();
      callback(client);
    })
    .catch(err => {
      console.log('failed to connect!', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw ('mo database found!');
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
