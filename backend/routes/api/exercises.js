const express = require('express');
const router = express.Router();
const exerciseController = require('../../controller/api/exercisesController');

router.route('/')
    .get(exerciseController.getExercises)
    .post(exerciseController.addExercisesToWorkout)
    .delete(exerciseController.deleteAllWorkoutExercises)

module.exports = router;