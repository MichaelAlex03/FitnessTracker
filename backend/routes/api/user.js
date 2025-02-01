const express = require ('express');
const router = express.Router();
const userController = require('../../controller/api/userController');

router.route('/:userName')
    .get(userController.getUserInfo)
    .patch(userController.updateUserInfo)

module.exports = router;