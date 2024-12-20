const db = require('.././config/dbConn');

const findUser = async (user) => {
    return await db.query('SELECT * FROM users WHERE user_name = $1', [user])
}

const saveUser = async (refreshToken, user) => {
    return await db.query('UPDATE users SET refresh_token = $1 WHERE user_name = $2', [refreshToken, user])
}

const getAllWorkouts = () => {
    return db.execute(Select)
}

module.exports = {
    findUser,
    saveUser,
}