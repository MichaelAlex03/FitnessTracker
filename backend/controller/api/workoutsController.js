const pg = require('../../model/sql');

const getWorkouts = async (req, res) => {
    const { id } = req.params;
    const workouts = await pg.getWorkouts(id);
    return res.status(200).json({ workouts: workouts });
}

const createWorkout = async (req, res) => {
    const { userId, workoutName } = req.body;
    try {
        const result = await pg.createWorkout(workoutName, userId);
        console.log("RES", result)
        return res.status(201).json({ workoutId: result.id });
    } catch (error) {
        console.error(error)
    }
}

const deleteWorkout = async (req, res) => {
    const { workoutId } = req.query;
    await pg.removeWorkout(workoutId);
    return res.status(200).json({ 'message': `workout ${workoutId} deleted` });
}

module.exports = {
    getWorkouts,
    createWorkout,
    deleteWorkout,
}