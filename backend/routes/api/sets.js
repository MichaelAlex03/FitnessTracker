const express = require('express')
const router = express.Router();
const setsController = require('../../controller/api/setsController');


router.route('/')
    .get()
    .post()
    .delete(setsController.removeAllSets)

module.exports = router;