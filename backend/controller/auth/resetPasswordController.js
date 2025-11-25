const bcrypt = require('bcrypt');
const pg = require('../../model/sql')
const { generateVerificationCode, verifyCodeExpiration, sendEmail } = require('../../utils/functions')


const sendEmailToUser = async (req, res) => {

    const { email } = req.body;
    const verificationCode = generateVerificationCode();
    const lowercasedEmail = email.toLowerCase()

    try {
        await pg.updateVerificationCode(lowercasedEmail, verificationCode);
        await sendEmail(lowercasedEmail, verificationCode);
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
    
    const lowercasedEmail = email.toLowerCase()
    const verificationCode = generateVerificationCode();

    try {
        await pg.updateVerificationCode(lowercasedEmail, verificationCode)
    } catch (error) {
        return res.status(500).json({ 'message': err.message })
    }

    await sendEmail(lowercasedEmail, verificationCode)
}   

module.exports = {
    sendEmailToUser,
    verifyEmail,
    changePassword,
    resendVerificationCode
}