const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies)
    const refreshToken = cookies.jwt;

    const founderUser = await pg.findRefreshToken(refreshToken)
    if (!founderUser) return res.sendStatus(403); //Forbidden
    //evaluate password

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || founderUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": founderUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            res.json({ accessToken, user: founderUser[0].user_name, id: founderUser[0].id });
        }
    );
}

module.exports = {
    handleRefreshToken
};