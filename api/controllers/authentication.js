var passport = require('passport');
var userModel = require('../models/users');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var {name, email, company, customerid, addresses} = req.body;
  var user = new userModel.userModel({
    name: name,
    email: email,
    company: company,
    customerid: customerid,
    addresses: addresses
  });

  user.setPassword(req.body.password);

  user.save(function(err, data) {
    if(err){
      console.error(err);
      return sendJSONresponse(res, 400, {
        "message": "Please provide valid values"
      });
    }

    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });

};

module.exports.login = function(req, res) {
  console.log('Login Request', req.body);

  if(!req.body.email || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  console.log('authenticating);')
  passport.authenticate('local', function(err, user, info){
    var token;
    console.log('Authenticated', err);

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};