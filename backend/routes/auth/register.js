const express = require('express');
const router = express.Router();
const registerController = require('../../controller/auth/registerController');

router.route('/')
    .post(registerController.handleNewUser);

router.route('/verify')
    .post(registerController.verifyUser)

module.exports = router;