const pg = require('../../model/sql')

const getUserInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const userInfo = await pg.findUserbyId(id);
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