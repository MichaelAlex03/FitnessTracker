const bcrypt = require('bcrypt');
const pg = require('../../model/sql')
const { generateVerificationCode, verifyCodeExpiration, sendEmail } = require('../../utils/functions')

const handleNewUser = async (req, res) => {
    const { user, pwd, email, phone } = req.body;

    const duplicate = await pg.findUser(user);
    console.log(duplicate)
    if (duplicate[0]?.user_name === user) return res.status(409).json({ message: "username already exists" });


    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const verificationCode = generateVerificationCode();
        const codeExpiration = verifyCodeExpiration();

        let newUser = {
            user,
            hashedPwd,
            email,
            phone,
            verificationCode,
            codeExpiration,
            verified: false,
            createdAt: new Date()
        }

        await pg.createUser(newUser);
        await sendEmail(email, verificationCode)
        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
}

const verifyUser = async (req, res) => {
    const { verificationCode, email } = req.body;

    const user = await pg.getVerificationCode(email);
    const matchingVerificationCode = user[0].verification_code


    if (Number(verificationCode) === matchingVerificationCode) {

        try {
            await pg.verifyUser(email);
            return res.sendStatus(200)
        } catch (error) {
            return res.status(500).json({ 'message': err.message })
        }
    }

    return res.sendStatus(204)
}

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    const verificationCode = generateVerificationCode();

    try {
        await pg.updateVerificationCode(email, verificationCode)
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