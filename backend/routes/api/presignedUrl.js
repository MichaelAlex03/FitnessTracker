const express = require('express');
const router = express.Router();
const presignedUrlController = require('../../controller/api/presignedUrlController');

router.route('/')
    .get(presignedUrlController.getS3Url)

module.exports = router;