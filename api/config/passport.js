var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    console.log(`Finding user ${username}`);
    user.userModel.findOne({ email: username }, function (err, user) {
      console.error('Passport', err);
      console.log('Passport', user);
      
      if (err) { return done(err); }
      
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));