const express = require('express');
const router = express.Router();
const templateController = require('../../controller/api/templatesController')

router.route('/')
    .get(templateController.getWorkoutTemplates)

module.exports = router