const express = require('express')
const router = express.Router();
const setsController = require('../../controller/api/setsController');

router.route('/')
    .post(setsController.createSet)
    .delete(setsController.removeAllSets)
    .patch(setsController.updateSets)

router.route('/userExercises/:userId/:exerciseName')
    .get(setsController.getExerciseSets)

router.route('/getAllSets/:workoutId')
    .get(setsController.getWorkoutSets)
    
router.route('/deleteSet/:setId')
    .delete(setsController.deleteSet)

module.exports = router;