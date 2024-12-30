const pg = require('../../model/sql')

const createSet = async (req, res) => {
    const { exercise, workoutId } = req.body;
    try {
        await pg.addSet(exercise, workoutId);
        return res.status(201).json({ 'message': 'set created!' });
    }
    catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}

const deleteSet = async (req, res) => {
    const { setId } = req.params;
    try {
        await pg.deleteSet(setId);
        return res.status(200).json({ 'message': 'set deleted!' });
    }
    catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}

const getUserSets = async (req, res) => {
    const { userId, exerciseName } = req.params;
    try {
        const sets = await pg.getAllSetsForExercise(userId, exerciseName);
        return res.status(200).json({ 'message': 'sets retrieved!', sets});
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}

const removeAllSets = async (req, res) => {
    const { workoutId } = req.query;
    await pg.removeAllSets(workoutId);
    return res.status(200).json({ 'message': `sets deleted for workout ${workoutId}` });
}

const getWorkoutSets = async (req, res) => {
    const { workoutId } = req.params;
    const result = await pg.getWorkoutSets(workoutId);
    return res.status(200).json({ sets: result.rows });
}



module.exports = {
    removeAllSets,
    getWorkoutSets,
    createSet,
    deleteSet
}