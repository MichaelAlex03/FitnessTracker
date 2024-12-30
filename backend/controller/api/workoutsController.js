const pg = require('../../model/sql');

const getWorkouts = async (req, res) => {
    const { userId } = req.query;
    const workouts = await pg.getWorkouts(userId);
    return res.status(200).json({ workouts: workouts.rows });
}

const createWorkout = async (req, res) => {
    const { userId, workoutName, selectedExercises } = req.body;
    if (!workoutName) return res.status(400).json({ 'message': 'workout name field is required' });
    if (selectedExercises.length === 0) return res.status(400).json({ 'message': 'please select at least one exercise' });

    const result = await pg.createWorkout(workoutName, userId);
    console.log(result)
    return res.status(201).json({ result: result.rows, workoutId: result.rows[0].id });
}

const deleteWorkout = async (req, res) => {
    const { workoutId } = req.params;
    await pg.removeWorkout(workoutId);
    return res.status(200).json({'message': `workout ${workoutId} deleted`});
}

module.exports = {
    getWorkouts,
    createWorkout,
    deleteWorkout,
}