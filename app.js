require('dotenv').config();

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://simone:${process.env.TOKEN}@cluster0.dbs3f3u.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ 
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}))

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    })
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User
      .findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'Simone',
            email: 'simone@test.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      })
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });