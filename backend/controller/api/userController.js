const pg = require('../../model/sql')
const bcrypt = require('bcrypt');

const getUserInfo = async (req, res) => {
    const { userName } = req.params;

    try {
        const userInfo = await pg.findUserSecure(userName);
        return res.status(200).json({ userInfo });
    } catch (error) {
        return res.sendStatus(500);
    }
}

const updateUserInfo = async (req, res) => {
    const { name, pwd, email } = req.body.updateData;

    if (!pwd) return res.status(400).json({ message: 'Cannot leave password field blank' })

    const hashedPass = await bcrypt.hash(pwd, 10);

    try {
        await pg.updateUserProfile(name, hashedPass, email)
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo,
};