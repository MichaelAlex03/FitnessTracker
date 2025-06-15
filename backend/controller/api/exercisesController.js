const pg = require('../../model/sql');

const getExercises = async (req, res) => {
    const result = await pg.getAllExercises();
    console.log("RESULT", result)
    return res.status(200).json({ exercises: result });
}

const addExercisesToWorkout = async (req, res) => {
    const { workoutId, selectedExercises } = req.body;
    if (!workoutId) return res.status(500).json({ 'message': 'workoutId was not retrieved' });

    const result = await pg.createWorkoutExercises(workoutId, selectedExercises);
    res.status(201).json({ result });
}

const updateWorkoutExercises = async (req, res) => {
    const { workoutId, selectedExercises, replace, exerciseToReplace } = req.body;

    try {
        if (replace) {
            await pg.replaceExercise(workoutId, exerciseToReplace, selectedExercises);
        } else {
            await pg.updateUserExercises(workoutId, selectedExercises);
        }
        res.status(200).json({ "message": "workout updated" })
    } catch (error) {
        res.sendStatus(500)
    }
}

const deleteAllWorkoutExercises = async (req, res) => {
    const { workoutId } = req.query;
    await pg.removeAllExercises(workoutId);
    return res.status(200).json({ 'message': `exercises deleted for workout ${workoutId}` });
}

const getWorkoutExercises = async (req, res) => {
    const { workoutId } = req.params;
    const result = await pg.getWorkoutExercises(workoutId);
    return res.status(200).json({ exercises: result });
}

const deleteExercise = async (req, res) => {
    const { exerciseId } = req.params;
    try {
        const result = await pg.deleteExercise(exerciseId);
        console.log(result)
        if (result == true) return res.status(200).json({ 'message': 'exercise deleted!' });
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}

module.exports = {
    getExercises,
    addExercisesToWorkout,
    deleteAllWorkoutExercises,
    getWorkoutExercises,
    deleteExercise,
    updateWorkoutExercises
}