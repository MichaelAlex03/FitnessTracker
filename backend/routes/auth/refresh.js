const express = require('express');
const router = express.Router();
const refreshController = require('../../controller/auth/refreshTokenController');

router.route('/')
    .get(refreshController.handleRefreshToken);

module.exports = router;