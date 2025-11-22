const express = require('express');
const router = express.Router();
const stripeController = require('../../controller/api/stripeController')

router.route('/payment-sheet')
    .post(stripeController.createStripeIntent)

module.exports = router