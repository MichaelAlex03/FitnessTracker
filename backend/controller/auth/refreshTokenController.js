const pg = require('../../model/sql');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    // Accept refresh token from request body (React Native)
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    const foundUser = await pg.findRefreshToken(refreshToken)
    if (!foundUser || foundUser.length === 0) return res.sendStatus(403); //Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser[0].user_name !== decoded.username) return res.sendStatus(403);

            // Create new access token with updated user data
            const accessToken = jwt.sign(
                {
                    "id": foundUser[0].id,
                    "email": foundUser[0].user_email,
                    "username": foundUser[0].user_name
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({
                accessToken,
                user: foundUser[0].user_name,
                id: foundUser[0].id,
                email: foundUser[0].user_email
            });
        }
    );
}

module.exports = {
    handleRefreshToken
};