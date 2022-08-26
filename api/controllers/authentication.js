var passport = require('passport');
var model = require('../models/users');
const loginValidator = require('../validations/login');

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
  const { error } = loginValidator.validate(req.body);
  
  if(error){
    console.log(error);
    return res.status(400).send(error.message);
  }

  console.log('validating user');
  passport.authenticate('local', function (err, user, info) {
    if (err) { // If Passport throws/catches an error
      return res.status(404).json(err);
    }

    if (!user) {
      return res.status(401).json(info); // When user is not found or password is not matched.
    } else {
      const token = user.generateJwt();
      return res.status(200).json({
        "token": token
      });
    }
  })(req, res);
};


module.exports.addAddress = function (req, res) {
  const { email, address } = req.body;
  if (!email || !address) {
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

      user.addresses.push(address);
      user.save(function (err, data) {
        if (err) {
          console.error(err);
          return sendJSONresponse(res, 500, {
            "message": "Unable to add address"
          });
        }

        res.status(200);
        res.json(data);
      });
    });
  }
  catch (err) { console.log(err); }
};