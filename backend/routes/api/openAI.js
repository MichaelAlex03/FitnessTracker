const express = require('express');
const router = express.Router();
const openAIController = require('../../controller/api/openAIController');

router.route('/')
    .post(openAIController.generateResponse)


module.exports = router