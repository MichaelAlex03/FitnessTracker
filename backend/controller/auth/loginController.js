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
            { "email": foundUser.user_email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.user_email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //Saving refresh token with current user
        await pg.updateUser(email, refreshToken);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken, id: foundUser[0].id, user: foundUser[0].user_name });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};