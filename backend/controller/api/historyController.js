const pg = require('../../model/sql');

const getWorkoutHistory = async (req, res) => {
    const { userId } = req.query;
    const workoutHistory = await pg.getWorkoutHistory(userId);
    return res.status(200).json({ workoutHistory: workoutHistory });
}

const getSetsHistory = async (req, res) => {
    const { userId } = req.query;
    return res.status(200).json({ "message": "sets retrieved" })
}

const getExercisesHistory = async (req, res) => {
    const { userId } = req.query;
    return res.status(200).json({ "message": "exercises retrieved" })
}

module.exports = {
    getWorkoutHistory,
    getSetsHistory,
    getExercisesHistory
}