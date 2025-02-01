const pg = require('../../model/sql')

const getUserInfo = async (req, res) => {
    const { userName } = req.params;
    console.log(userName)

    try {
        const userInfo = await pg.findUserSecure(userName);
        return res.status(200).json({ userInfo });
    } catch (error) {
        return res.sendStatus(500);
    }
}

const updateUserInfo = async (req, res) => {

}

module.exports = {
    getUserInfo,
    updateUserInfo,
};