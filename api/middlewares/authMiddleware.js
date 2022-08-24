var jwt = require('jsonwebtoken');
var asyncHandler = require('express-async-handler');
var model = require('../models/users.js');

module.exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const JWT_SECRET = process.env.JWT_CODE || 'MY_SECRET';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await model.userModel.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      res.send('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    res.send('Not authorized, no token');
  }
});