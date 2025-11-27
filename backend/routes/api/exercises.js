const express = require('express');
const router = express.Router();
const exerciseController = require('../../controller/api/exercisesController');

router.route('/')
    .get(exerciseController.getExercises)
    .post(exerciseController.addExercisesToWorkout)
    .delete(exerciseController.deleteAllWorkoutExercises)
    .patch(exerciseController.updateWorkoutExercises)

router.route('/getWorkoutExercises/:workoutId')
    .get(exerciseController.getWorkoutExercises)

router.route('/delete/:exerciseId')
    .delete(exerciseController.deleteExercise)

router.route('/add')
    .post()

module.exports = router;