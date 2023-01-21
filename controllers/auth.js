const bcrypt = require('bcryptjs');
const User = require('../models/user');

// 註冊
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message,
  });
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User
    .findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log(err);
    });
};

// 登入
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User
    .findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      return bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        })
    })
};

// 登出
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  })
};
