var express = require('express');
var handlers = require('../middlewares/authMiddleware');
var ctrlAuth = require('../controllers/authentication');
var ctrlPwd = require('../controllers/password');
var ctrlInv = require('../controllers/catalog');

const router = express.Router();

// authentication
router.post('/user/register', ctrlAuth.register);
router.post('/user/login', ctrlAuth.login);
router.post('/user/address', ctrlAuth.addAddress)

// Password Management
router.post('/password/change', handlers.protect, ctrlPwd.change);
router.post('/password/reset', ctrlPwd.reset);

// Product
router.get('/product', ctrlInv.find);
router.get('/product/import', ctrlInv.import);

router.get('/', (req, res) => {
  res.send('hello world!')
});

module.exports = router;