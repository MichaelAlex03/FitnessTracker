const pg = require('../../model/sql')

const getUserInfo = async (req, res) => {
    const { userName } = req.params;

    try {
        const userInfo = await pg.findUserSecure(userName);
        res.sendStatus(200).json({ userInfo });
    } catch (error) {
        res.sendStatus(500);
    }
}

const updateUserInfo = async (req, res) => {

}

module.exports = {
    getUserInfo,
    updateUserInfo,
};