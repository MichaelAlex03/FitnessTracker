const express = require('express');
const router = express.Router();
const exerciseController = require('../../controller/api/exercisesController');

router.route('/')
    .get(exerciseController.getExercises)
    .post(exerciseController.addExercisesToWorkout)
    .delete(exerciseController.deleteAllWorkoutExercises)

router.route('/getWorkoutExercises/:workoutId')
    .get(exerciseController.getWorkoutExercises)

router.route('/delete/:exerciseId')
    .delete(exerciseController.deleteExercise)

module.exports = router;