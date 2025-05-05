const express = require('express')
const router = express.Router();
const setsController = require('../../controller/api/setsController');

router.route('/')
    .delete(setsController.removeAllSets)
    .patch(setsController.updateSets)

router.route('/userExercises/:userId/:exerciseName')
    .get(setsController.getExerciseSets)

router.route('/getAllSets/:workoutId')
    .get(setsController.getWorkoutSets)
    

module.exports = router;