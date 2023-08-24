const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const expressSession = require('express-session');
const passport = require('passport');
const configurePassport = require('../config/passportconfig');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

configurePassport();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
});

module.exports = app;
