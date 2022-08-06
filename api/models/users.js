var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const addressSchema = mongoose.Schema({
  address1: String,
  address2: String, 
  city: String,
  state: String,
  zipcode: {type: String, maxlength: 5},
  phone: {type: String, maxlength: 10}
});

var userSchema = new mongoose.Schema({
  customerid: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  addresses: [addressSchema],
  hash: String,
  salt: String
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email, 
    name: this.name,
    company: this.company,
    customerid: this.customerid,
    addresses: this.addresses,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var userModel = mongoose.model('User', userSchema);
module.exports.userModel = userModel;