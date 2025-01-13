const express = require('express');
const router = express.Router();
const logoutController = require('../../controller/auth/logoutController');

router.route('/')
    .get(logoutController.handleLogout);

module.exports = router;