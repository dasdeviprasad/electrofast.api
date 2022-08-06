var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/users');

var ctrlAuth = require('../controllers/authentication');

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', (req, res) => {
  console.log('Login Request', req.body);

  if(!req.body.email || !req.body.password) {
    return sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
  }

  return sendJSONresponse(res, 400, {
    "message": "All fields required"
  });

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
});

router.get('/', (req, res) => {
  res.send('hello world!')
})

module.exports = router;
