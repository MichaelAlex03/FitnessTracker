const express = require('express')
const router = express.Router();
const workoutsController = require('../../controller/api/workoutsController');

router.route('/')
    .post(workoutsController.createWorkout)
    .delete(workoutsController.deleteWorkout)

router.route('/:id')
    .get(workoutsController.getWorkouts)
    .patch(workoutsController.updateWorkout)

router.route('/history')
    .get(workoutsController.getWorkoutHistory)

module.exports = router;