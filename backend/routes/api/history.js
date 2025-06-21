const express = require('express');
const router = express.Router()
const historyController = require('../../controller/api/historyController');

router.route('/:userId')
    .get(historyController.getWorkoutHistory)
    
router.route('/delete/:workoutId')
    .delete(historyController.deleteWorkout)

router.route('/sets/:exerciseName')
    .get(historyController.getPreviousSets)

module.exports = router;