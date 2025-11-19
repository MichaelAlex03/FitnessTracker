const express = require('express');
const router = express.Router();
const openAIController = require('../../controller/api/openAIController');

router.route('/')
    .get(openAIController.getResponse)


module.exports = router