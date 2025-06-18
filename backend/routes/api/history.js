const express = require('express');
const router = express.Router()
const historyController = require('../../controller/api/historyController');

router.route('/:userId')
    .get(historyController.getWorkoutHistory)

module.exports = router