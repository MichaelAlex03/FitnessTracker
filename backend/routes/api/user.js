const express = require('express');
const router = express.Router();
const userController = require('../../controller/api/userController');

router.route('/')
    .patch(userController.updateUserInfo)

router.route('/:userName')
    .get(userController.getUserInfo)
    .patch(userController.updateUserInfo)

module.exports = router;