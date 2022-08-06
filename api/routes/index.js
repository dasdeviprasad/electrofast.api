var express = require('express');
var router = express.Router();

var ctrlAuth = require('../controllers/authentication');

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/', (req, res) => {
  res.send('hello world!')
})

module.exports = router;
