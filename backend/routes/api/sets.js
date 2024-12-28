const express = require('express')
const router = express.Router();
const setsController = require('../../controller/api/setsController');

router.route('/')
    .delete(setsController.removeAllSets)

router.route('/:workoutId')
    .get(setsController.getWorkoutSets)

module.exports = router;