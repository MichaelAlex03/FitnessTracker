const express = require('express');
const router = express.Router();
const s3Controller = require('../../controller/api/s3Controller');

router.route('/')
    .get(s3Controller.getS3Url)

module.exports = router;