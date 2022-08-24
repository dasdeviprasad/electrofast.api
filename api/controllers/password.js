var model = require('../models/users');
const changePwdValidator = required('../validations/changePassword');

module.exports.change = function (req, res) {
  const { error } = loginValidator.validate(req.body);
  
  if(error){
    console.log(error);
    return res.status(400).send(error.message);
  }

  const { email, oldPassword, newPassword } = value;
  try {
    console.log('Find user');
    model.userModel.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }

      // Return if user not found in database
      if (!user) {
        return res.status(404).json({ "message": "User not found" });
      }
      // Return if password is wrong
      if (!user.validPassword(oldPassword)) {
        return res.status(500).json({ "message": "Password is wrong!" });
      }

      user.setPassword(newPassword);
      user.save(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(500).json({ "message": "Unable to change password" });
        }

        return res.status(200).json(user);
      });
    });
  }
  catch (err) { console.log(err); }
};

module.exports.reset = function (req, res) {
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