const pg = require('../../model/sql');

const getExercises = async (req, res) => {
    const { userId } = req.params
    const result = await pg.getAllExercises(userId);
    return res.status(200).json({ exercises: result });
}

const addExercisesToWorkout = async (req, res) => {
    const { workoutId, selectedExercises } = req.body;
    if (!workoutId) return res.status(500).json({ 'message': 'workoutId was not retrieved' });

    const result = await pg.createWorkoutExercises(workoutId, selectedExercises);
    res.status(201).json({ result });
}

const addExercise = async (req, res) => {
    const { exerciseName, exerciseCategory, exerciseBodyPart, exerciseInstructions, userId } = req.body;

    try {
        await pg.addExercise(exerciseName, exerciseCategory, exerciseBodyPart, exerciseInstructions, userId);
        return res.status(201).json({ 'message': 'exercises added' });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }

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

const deleteExerciseFromWorkout = async (req, res) => {
    const { exerciseId } = req.params;
    try {
        const result = await pg.deleteExerciseFromWorkout(exerciseId);
        if (result == true) return res.status(200).json({ 'message': 'exercise deleted!' });
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}

const getExercise = async (req, res) => {
    const { exercise_id } = req.params;

    try {
        const result = await pg.getExercise(exercise_id);
        return res.status(200).json({ result })
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

const updateExercise = async (req, res) => {
    const { exercise_id } = req.params;

    const { exercise } = req.body

    try {
        const result = await pg.updateExercise(exercise_id, exercise);
        return res.status(200).json({ result })
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

const deleteExercise = async (req, res) => {
    const { exercise_id } = req.params;

    try {
        await pg.deleteExercise(exercise_id);
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

module.exports = {
    getExercises,
    addExercisesToWorkout,
    deleteAllWorkoutExercises,
    getWorkoutExercises,
    deleteExerciseFromWorkout,
    updateWorkoutExercises,
    addExercise,
    getExercise,
    updateExercise,
    deleteExercise
}