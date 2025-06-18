const pg = require('../../model/sql');

const getWorkoutHistory = async (req, res) => {
    const { userId } = req.params;
  
    try {
        const { workouts, exercises, sets } = await pg.getRecentWorkoutHistory(userId, '');
        return res.status(200).json({ workouts, exercises, sets, "message": "workout history retrieved" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "server error" });
    }
}

module.exports = {
    getWorkoutHistory
}