const pg = require('../../model/sql')

// const deleteSet = async (req, res) => {
//     const { setId } = req.params;
//     try {
//         await pg.deleteSet(setId);
//         return res.status(200).json({ 'message': 'set deleted!' });
//     }
//     catch (err) {
//         return res.status(500).json({ 'message': err.message });
//     }
// }

const getExerciseSets = async (req, res) => {
    const { userId, exerciseName } = req.params;
    try {
        const sets = await pg.getAllSetsForExercise(userId, exerciseName);
        return res.status(200).json({ 'message': 'sets retrieved!', sets });
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
    return res.status(200).json({ sets: result });
}

const updateSets = async (req, res) => {
    const { exerciseSets, workoutId} = req.body;
    try {
        //First update workout template
        await pg.updateSets(exerciseSets, workoutId);

        //Then add sets to history table
        await pg.addSetsToHistory(exerciseSets);
        return res.status(200).json({ 'message': 'sets updated!' });
    } catch (err) {
        return res.status(500).json({ 'message': err.message });
    }
}


module.exports = {
    removeAllSets,
    getWorkoutSets,
    // deleteSet,
    getExerciseSets,
    updateSets,
}