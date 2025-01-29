const pg = require('../../model/sql')

const getUserInfo = (req, res) => {
    const { id } = req.params;
    
    try {
        const userInfo = pg.
    } catch (error) {
        res.sendStatus(500);
    }
}

const updateUserInfo = (req, res) => {

}

module.exports = {
    getUserInfo,
    updateUserInfo,
};