
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('../../model/sql');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    console.log(user)

    const foundUser = await pg.findUser(user);
    console.log("USERRRR" , foundUser[0])
    if (foundUser[0]?.user_name === '') return res.sendStatus(401); //user not found
    console.log("Hereee")
    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser[0]?.user_pass);
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
        await pg.updateUser(user, refreshToken);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken, id: foundUser[0].id });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};