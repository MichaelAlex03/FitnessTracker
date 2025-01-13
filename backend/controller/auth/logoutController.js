const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    //on client, also delete the accessToken

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    //isRefreshToken in db?
    const founderUser = await pg.findRefreshToken(refreshToken)
    if (!founderUser) {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204); //Succesful but no content
    }

    //Delete refresh token in db
    const result = pg.updateUser(founderUser.data.user_name, '')
    console.log(result);

    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);

};

module.exports = {
    handleLogout
};