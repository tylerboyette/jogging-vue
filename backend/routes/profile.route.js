const express = require('express');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router.use(userCtrl.getProfile);

router.route('/me')
  .put(userCtrl.updateProfile);

module.exports = router;
