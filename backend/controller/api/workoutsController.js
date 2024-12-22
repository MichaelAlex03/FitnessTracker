const pg = require('../../model/sql');

const getWorkouts = async (req, res) => {
    const { userId } = req.query;
    const workouts = await pg.getWorkouts(userId);
    return res.status(200).json({ workouts: workouts.rows });
}

module.exports = {
    getWorkouts,
}