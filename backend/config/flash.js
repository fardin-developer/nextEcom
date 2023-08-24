const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
  
const app = express();

app.use(session({
    secret:'flashblog',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());
// module.exports = app