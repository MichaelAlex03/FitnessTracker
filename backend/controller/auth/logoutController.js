const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    //on client, also delete the accessToken
    console.log('test')
    const cookies = req.cookies
    console.log('cookies: ',cookies)
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    console.log(refreshToken)

    //isRefreshToken in db?
    const founderUser = await pg.findRefreshToken(refreshToken)
    console.log(founderUser.rows[0].user_name)
    if (!founderUser) {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204); //Succesful but no content
    }

    //Delete refresh token in db
    // console.log('user: ' , founderUser)
    const updatedRefresh = ''
    const result = await pg.updateUser(founderUser.rows[0].user_name, updatedRefresh)
    console.log(result);

    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
    res.status(204).json({ 'message': 'Cookie deleted' });

};

module.exports = {
    handleLogout
};