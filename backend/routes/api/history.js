const express = require('express');
const router = express.Router()
const historyController = require('../../controller/api/historyController');

router.route('/')
    .get(historyController.getWorkoutHistory)

module.exports = router