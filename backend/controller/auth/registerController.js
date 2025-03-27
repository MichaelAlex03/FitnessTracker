const bcrypt = require('bcrypt');
const pg = require('../../model/sql')

const handleNewUser = async (req, res) => {
    const { user, pwd, email, phone } = req.body;

    //check for duplicate usernames in the db
    const duplicate = await pg.findUser(user);
    console.log(duplicate)
    if (duplicate[0]?.user_name === user) return res.status(409).json({message: "username already exists"}); //conflict

    //Check if email exists in the 
    // if (duplicate[0].user_email === email)

    try {
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        await pg.createUser(user, hashedPwd)
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = {
    handleNewUser
};