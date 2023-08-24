const LocalStrategy = require('passport-local').Strategy;
const User = require('.././models/userModel');
const passport = require('passport');
const bcrypt = require('bcrypt');

const configurePassport = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, // If you want to log in with a username, change the userField email to username
      (username, password, done) => {
        User.findOne({
          $or: [{ username: username }, { email: username }]
        })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }

            // Compare the entered password with the hashed password stored in the database
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                return done(err);
              }

              if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
              }

              return done(null, user);
            });
          })
          .catch((err) => {
            return done(err);
          });
      })
  );
};

module.exports = configurePassport;
