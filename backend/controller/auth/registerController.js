const bcrypt = require('bcrypt');
const pg = require('../../model/sql')
const { generateVerificationCode, verifyCodeExpiration, sendEmail } = require('../../utils/functions')

const handleNewUser = async (req, res) => {
    const { user, pwd, email, phone } = req.body;

    const duplicate = await pg.findUser(user);
    
    if (duplicate[0]?.user_name === user) return res.status(409).json({ message: "username already exists" });


    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const verificationCode = generateVerificationCode();
        const codeExpiration = verifyCodeExpiration();
        const lowercasedEmail = email.toLowerCase()

        let newUser = {
            user,
            hashedPwd,
            email: lowercasedEmail,
            phone,
            verificationCode,
            codeExpiration,
            verified: false,
            createdAt: new Date()
        }

        await pg.createUser(newUser);
        await sendEmail(lowercasedEmail, verificationCode)
        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
}

const verifyUser = async (req, res) => {
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

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    const verificationCode = generateVerificationCode();
    const lowercasedEmail = email.toLowerCase()

    try {
        await pg.updateVerificationCode(lowercasedEmail, verificationCode)
    } catch (error) {
        return res.status(500).json({ 'message': err.message })
    }

    await sendEmail(email, verificationCode)
}

module.exports = {
    handleNewUser,
    verifyUser,
    resendVerificationCode
};