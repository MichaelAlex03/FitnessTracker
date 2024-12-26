const pg = require('../../model/sql');

const getExercises = async (req, res) => {
    const result = await pg.getAllExercises();
    return res.status(200).json({ rows: result.rows });
}

const addExercisesToWorkout = async (req, res) => {
    const { workoutId, selectedExercises } = req.body;
    if (!workoutId) return res.status(500).json({ 'message': 'workoutId was not retrieved' });

    const result = await pg.createWorkoutExercises(workoutId, selectedExercises);
    res.status(201).json({ result });
}

module.exports = {
    getExercises,
    addExercisesToWorkout,
}