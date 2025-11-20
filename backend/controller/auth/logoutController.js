const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    // Accept refresh token from request body (React Native)
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(204); //No content

    //isRefreshToken in db?
    const foundUser = await pg.findRefreshToken(refreshToken)
    if (!foundUser || foundUser.length === 0) {
        return res.sendStatus(204); //Successful but no content
    }

    //Delete refresh token in db
    const updatedRefresh = ''
    await pg.updateUser(foundUser[0].user_name, updatedRefresh)

    res.sendStatus(204); // Success, token invalidated
};

module.exports = {
    handleLogout
};