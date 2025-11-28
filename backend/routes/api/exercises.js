const express = require('express');
const router = express.Router();
const exerciseController = require('../../controller/api/exercisesController');

router.route('/')
    .post(exerciseController.addExercisesToWorkout)
    .delete(exerciseController.deleteAllWorkoutExercises)
    .patch(exerciseController.updateWorkoutExercises)

router.route('/:userId')
    .get(exerciseController.getExercises)

router.route('/getWorkoutExercises/:workoutId')
    .get(exerciseController.getWorkoutExercises)

router.route('/delete/:exerciseId')
    .delete(exerciseController.deleteExerciseFromWorkout)

router.route('/add')
    .post(exerciseController.addExercise)

router.route('/exercise/:exercise_id')
    .get(exerciseController.getExercise)
    .patch(exerciseController.updateExercise)
    .delete(exerciseController.deleteExercise)

module.exports = router;