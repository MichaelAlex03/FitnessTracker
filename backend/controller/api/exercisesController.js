const pg = require('../../model/sql');

const getExercises = async (req, res) => {
    const result = await pg.getAllExercises();
    return res.status(200).json({ rows: result.rows });
}

const createWorkout = async (req, res) => {

}

module.exports = {
    getExercises,
}