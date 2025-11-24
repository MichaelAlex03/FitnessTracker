const { transporter } = require('../config/emailConfig');


const generateVerificationCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

const verifyCodeExpiration = () => {
    const now = new Date();
    const expirationDate = now.getTime() + (15 * 60 * 1000)
    return new Date(expirationDate)
}

const sendEmail = async (email, verificationCode) => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - FitTrackr</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #FF9C01 0%, #FFB001 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #161622; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                                    FitTrackr
                                </h1>
                                <p style="margin: 8px 0 0 0; color: #161622; font-size: 14px; opacity: 0.9;">
                                    Your Fitness Journey Starts Here
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 50px 40px;">
                                <h2 style="margin: 0 0 20px 0; color: #161622; font-size: 24px; font-weight: 700;">
                                    Verify Your Email Address
                                </h2>
                                <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Thank you for signing up! To complete your registration and start your fitness journey, please use the verification code below:
                                </p>

                                <!-- Verification Code Box -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="background-color: #f8f8f8; border: 2px dashed #FF9C01; border-radius: 8px; padding: 30px; text-align: center;">
                                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                                                Your Verification Code
                                            </p>
                                            <p style="margin: 0; color: #161622; font-size: 42px; font-weight: 800; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                                                ${verificationCode.slice(0, 4)}-${verificationCode.slice(4)}
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                    <strong>⏱️ This code will expire in 15 minutes.</strong><br>
                                    For security reasons, please do not share this code with anyone.
                                </p>

                                <p style="margin: 30px 0 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    If you didn't create an account with FitTrackr, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #161622; padding: 30px 40px; text-align: center;">
                                <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                                    FitTrackr
                                </p>
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    © ${new Date().getFullYear()} FitTrackr. All rights reserved.
                                </p>
                                <p style="margin: 15px 0 0 0; color: #666666; font-size: 11px;">
                                    This is an automated message, please do not reply to this email.
                                </p>
                            </td>
                        </tr>
                    </table>

                    <table width="600" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding: 20px 0; text-align: center;">
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    Need help? Contact us at support@fittrackr.com
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const plainText = `
FitTrackr - Email Verification

Thank you for signing up!

Your verification code is: ${verificationCode}

This code will expire in 15 minutes.

If you didn't create an account with FitTrackr, you can safely ignore this email.

---
© ${new Date().getFullYear()} FitTrackr. All rights reserved.
Need help? Contact us at support@fittrackr.com
    `.trim();


    try {
        const info = await transporter.sendMail({
            from: '"FitTrackr" <michaelalex2003@gmail.com>',
            to: email,
            subject: "Verify Your Email - FitTrackr",
            text: plainText,
            html: htmlTemplate,
        });

        console.log("Verification email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Failed to send email:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    generateVerificationCode,
    verifyCodeExpiration,
    sendEmail
}