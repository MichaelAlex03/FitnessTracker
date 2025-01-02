
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('../../model/sql');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    console.log(req.body)
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    const foundUser = await pg.findUser(user);
    if (foundUser.rows.length !== 1) return res.sendStatus(401); //user not found
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.rows[0].user_pass);
    if (match) {
        //create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.user },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        //Saving refresh token with current user
        console.log('This is refreshToken:' + refreshToken);
        console.log('This is accessToken:' + accessToken);
        const result = await pg.updateUser(user, refreshToken);
    

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken, foundUser: foundUser.rows});
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};