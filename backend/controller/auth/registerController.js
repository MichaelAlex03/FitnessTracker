const bcrypt = require('bcrypt');
const pg = require('../../model/sql')
const { generateVerificationCode, verifyCodeExpiration } = require('../../utils/functions')

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
            verified: false
        }

        await pg.createUser(newUser)
        res.status(201).json({ 'success': `New user created!` });
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
}

const verifyUser = async (req, res) => {
    const { verificationCode, email } = req.body;

    const user = pg.getVerificationCode(email);
    const matchingVerificationCode = user.verification_code

    if (verificationCode === matchingVerificationCode) {

        try {
            pg.verifyUser(email);
            return res.sendStatus(200)
        } catch (error) {
            res.status(500).json({ 'message': err.message })
        }
    }

    return res.sendStatus(204)
}

module.exports = {
    handleNewUser,
    verifyUser
};