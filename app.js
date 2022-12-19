const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const authRoutes = require("./routes/auth");

const mongoConnect = require("./utils/database").mongoConnect;

const User = require('./models/user');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false}))

app.use((req, res, next) => {
  User
    .findById('639f30a312fd1c6b80765730')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
// app.use(authRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});