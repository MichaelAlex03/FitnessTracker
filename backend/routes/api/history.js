const express = require('express');
const router = express.Router()
const historyController = require('../../controller/api/historyController');

router.route('/workouts/:userId')
    .get(historyController.getWorkoutHistory)

router.route('/exercises/:userId')
    .get(historyController.getExercisesHistory)

router.route('/sets/:userId')
    .get(historyController.getSetsHistory)

module.exports = router