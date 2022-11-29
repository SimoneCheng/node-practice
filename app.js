const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const sequelize = require("./utils/database");

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false}))

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,  { through : CartItem });
Product.belongsToMany(Cart,  { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      User.create({ name: 'Simone', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
