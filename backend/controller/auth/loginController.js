const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('../../model/sql');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required' });

    const foundUser = await pg.findUser(email);
    
    if (foundUser[0]?.user_email === '' || foundUser.length === 0) {
        return res.sendStatus(401); //user not found
    }
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser[0]?.user_pass);
    if (match) {
        //create JWTs
        const accessToken = jwt.sign(
            {
                "id": foundUser[0].id,
                "email": foundUser[0].user_email,
                "username": foundUser[0].user_name
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            {
                "id": foundUser[0].id,
                "email": foundUser[0].user_email,
                "username": foundUser[0].user_name
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        //Saving refresh token with current user
        await pg.updateUser(email, refreshToken);

        // Send both tokens in response body for React Native
        res.status(200).json({
            accessToken,
            refreshToken,  // Send refresh token in body instead of cookie
            id: foundUser[0].id,
            user: foundUser[0].user_name
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};