var passport = require('passport');
var model = require('../models/users');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function (req, res) {
  console.log('Received');
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  try {
    console.log('Body', req.body);
    var { name, email, company, customerid, addresses } = req.body;
    var user = new model.userModel({
      name: name,
      email: email,
      company: company,
      customerid: customerid,
      addresses: addresses
    });

    console.log(JSON.stringify(user));
    user.setPassword(req.body.password);

    console.log('Saving');
    user.save(function (err, data) {
      if (err) {
        console.error(err);
        return sendJSONresponse(res, 400, {
          "message": "Please provide valid values"
        });
      }

      console.log('Token');
      var token;
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    });
  }
  catch (e) {
    console.log(e);
  }
};

module.exports.login = function (req, res) {
  console.log('Login Request', req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
  }

  console.log('Authenticating...')
  passport.authenticate('local', function (err, user, info) {
    var token;
    console.log('Authenticated', err);

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.changePassoword = function (req, res) {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  try {
    console.log('Find user');
    model.userModel.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }

      // Return if user not found in database
      if (!user) {
        return sendJSONresponse(res, 404, {
          "message": "User not found"
        });
      }
      // Return if password is wrong
      if (!user.validPassword(oldPassword) {
        return sendJSONresponse(res, 500, {
          "message": "Password is wrong!"
        });
      }

      user.setPassword(newPassword);
      user.save(function (err, data) {
        if (err) {
          console.error(err);
          return sendJSONresponse(res, 500, {
            "message": "Unable to change password"
          });
        }

        res.status(200);
        res.json(user);
      });
    });
  }
  catch (err) { console.log(err); }
};

module.exports.resetPassoword = function (req, res) {
  const { email } = req.body
  if (!email) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  try {
    model.userModel.findOne({ email: req.body.email }, function (err, user) {
      if (err) { return done(err); }

      // Return if user not found in database
      if (!user) {
        return sendJSONresponse(res, 404, {
          "message": "User not found"
        });
      }

      user.setPassword('1234');
      user.save(function (err, data) {
        if (err) {
          console.error(err);
          return sendJSONresponse(res, 500, {
            "message": "Unable to reset password"
          });
        }

        res.status(200);
        res.json(user);
      });
    });
  }
  catch (err) { console.log(err); }
};