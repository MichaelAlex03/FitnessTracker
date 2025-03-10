const bcrypt = require('bcrypt');
const pg = require('../../model/sql')

const handleNewUser = async (req, res) => {
    const { user, pwd, email } = req.body;
    if (!user || !pwd || !email) return res.status(400).json({ message: 'All fields are required' });

    //check for duplicate usernames in the db
    const duplicate = await pg.findUser(user);
    console.log(duplicate)
    if (duplicate[0].user_name === user) return res.sendStatus(409); //conflict

    //Check if email exists in the 
    if (duplicate[0].user_email === email)

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