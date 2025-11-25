const express = require('express');
const router = express.Router();
const resetPasswordController = require('../../controller/auth/resetPasswordController');

router.route('/send-email')
    .post(resetPasswordController.sendEmailToUser)

router.route('/verify')
    .post(resetPasswordController.verifyEmail)

router.route('/reset-password')
    .patch(resetPasswordController.changePassword)

router.route('/resend-email')
    .post(resetPasswordController.resendVerificationCode)

module.exports = router;