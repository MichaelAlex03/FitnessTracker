const pg = require('../../model/sql');

const getWorkoutHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const { workouts, exercises, sets } = await pg.getRecentWorkoutHistory(userId, '');
        return res.status(200).json({ workouts, exercises, sets, "message": "workout history retrieved" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "server error" });
    }
}

const deleteWorkout = async (req, res) => {
    const { workoutId } = req.params

    try {
        await pg.deleteWorkoutFromHistory(workoutId);
        return res.status(204).json({ "message": `deletion of workout ${workoutId} successfull` })
    } catch (error) {
        console.error(error);
        return res.status(500), json({ "message": "delete failed" });
    }
}

const getPreviousSets = async (req, res) => {
    const { exerciseName } = req.params

    try {
        const previousSets = await pg.getPreviousSets(exerciseName);
        return res.status(200).json({ "message": "previous sets retrieved", previousSets });
    } catch (error) {
        console.error(error);
        return res.status(500), json({ "message": "retrieval failed" });
    }
}

module.exports = {
    getWorkoutHistory,
    deleteWorkout,
    getPreviousSets
}