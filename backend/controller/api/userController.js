const pg = require('../../model/sql')
const bcrypt = require('bcrypt');

const getUserInfo = async (req, res) => {
    const { userName } = req.params;

    try {
        const userInfo = await pg.findUserSecure(userName);
        console.log(userInfo)
        return res.status(200).json({ userInfo });
    } catch (error) {
        return res.sendStatus(500);
    }
}

const updateUserInfo = async (req, res) => {
    const { prevName, name, phone, email, imageUrl } = req.body.updateData;

    try {
        await pg.updateUserProfile(prevName, name, phone, email, imageUrl)
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = {
    getUserInfo,
    updateUserInfo,
};