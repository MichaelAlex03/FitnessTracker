const express = require('express')
const router = express.Router();
const workoutsController = require('../../controller/api/workoutsController');

router.route('/')
    .get(workoutsController.getWorkouts)
    .post()
    .delete()

module.exports = router;