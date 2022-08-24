var express = require('express');
var router = express.Router();
var passport = require('passport');

var ctrlAuth = require('../controllers/authentication');
var ctrlInv = require('../controllers/catalog');

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/password/change', ctrlAuth.changePassoword);
router.post('/password/reset', ctrlAuth.resetPassword);

router.get('/product', ctrlInv.find);
router.get('/product/import', ctrlInv.import);

router.get('/', (req, res) => {
  res.send('hello world!')
});

module.exports = router;