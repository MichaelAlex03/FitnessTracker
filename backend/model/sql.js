const db = require('.././config/dbConn');

const findUser = async (user) => {
    return await db.query('SELECT * FROM users WHERE user_name = $1', [user])
}

const updateUser = async (refreshToken, user) => {
    return await db.query('UPDATE users SET refresh_token = $1 WHERE user_name = $2', [refreshToken, user])
}

const createUser = async (user, pwd) => {
    return await db.query('INSERT INTO users (user_name, user_pass) VALUES( $1, $2)', [user, pwd]);
}

const getAllWorkouts = () => {
    return db.execute(Select)
}

module.exports = {
    findUser,
    updateUser,
    createUser,
}