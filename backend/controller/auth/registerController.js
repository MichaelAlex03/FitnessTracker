const bcrypt = require('bcrypt');
const pg = require('../../model/sql')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    console.log(req.body)
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required'});
    console.log("made it")

    //check for duplicate usernames in the db
    const duplicate = await pg.findUser(user);
    if (duplicate.rows.length !== 0) return res.sendStatus(409); //conflict
    try{
        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await pg.createUser(user, hashedPwd)
        console.log(result);
        res.status(201).json({ 'success': `New user ${user} created!`});
    }catch(err){
        res.status(500).json({ 'message': err.message})
    }
}

module.exports = {
    handleNewUser
};