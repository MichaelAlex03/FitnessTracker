const bcrypt = require('bcrypt');
const pg = require('../../model/sql')
const { generateVerificationCode, verifyCodeExpiration, sendEmail } = require('../../utils/functions')


const sendEmailToUser = async (req, res) => {

    const { email } = req.body;

    const lowercasedEmail = email.toLowerCase();


    try {
        const user = await pg.findUser(lowercasedEmail);

        if (user && user.length > 0) {
            const verificationCode = generateVerificationCode();
            const codeExpiration = verifyCodeExpiration()
            await pg.updateVerificationCode(lowercasedEmail, verificationCode, codeExpiration);
            await sendEmail(lowercasedEmail, verificationCode);
        }
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }

}



const verifyEmail = async (req, res) => {
    const { verificationCode, email } = req.body;

    const lowercasedEmail = email.toLowerCase()
    const user = await pg.getVerificationCode(lowercasedEmail);
    const matchingVerificationCode = user[0].verification_code


    if (Number(verificationCode) === matchingVerificationCode) {

        try {
            await pg.verifyUser(lowercasedEmail);
            return res.sendStatus(200)
        } catch (error) {
            return res.status(500).json({ 'message': err.message })
        }
    }

    return res.sendStatus(204)
}

const changePassword = async (req, res) => {
    const { newPassword, email } = req.body;
    const lowercasedEmail = email.toLowerCase()

    const hashedPwd = await bcrypt.hash(newPassword, 10);

    try {
        await pg.updatePassword(lowercasedEmail, hashedPwd);
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({ 'message': err.message })
    }
}

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    const lowercasedEmail = email.toLowerCase();


    try {
        const user = await pg.findUser(lowercasedEmail);

        if (user && user.length > 0) {
            const verificationCode = generateVerificationCode();
            const codeExpiration = verifyCodeExpiration()
            await pg.updateVerificationCode(lowercasedEmail, verificationCode, codeExpiration);
            await sendEmail(lowercasedEmail, verificationCode);
        }
        return res.sendStatus(200)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ 'message': err.message })
    }

}

module.exports = {
    sendEmailToUser,
    verifyEmail,
    changePassword,
    resendVerificationCode
}