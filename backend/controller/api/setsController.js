const pg = require('../../model/sql')


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
    const { exerciseSets, exercises, workoutId, workoutName, save, userId } = req.body;

    console.log(save)
    try {
        //First update workout template
        await pg.updateSets(exerciseSets, workoutId);

        if (save === false) {

            //Add workout to history
            const workoutHistoryId = await pg.addWorkoutToHistory(userId, workoutName);
            
            //Add exercises to history
            const exerciseHistoryData = await pg.addExercisesToHistory(workoutHistoryId, exercises);

            // Create a mapping of old exercise IDs to new exercise history IDs
            const exerciseHistoryMap = {};  
            exercises.forEach((exercise, index) => {
                exerciseHistoryMap[exercise.id] = exerciseHistoryData[index].id
            })


            //Add sets to history
            await pg.addSetsToHistory(workoutHistoryId, exerciseSets, exerciseHistoryMap);


        }
        return res.status(200).json({ 'message': 'sets updated!' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ 'message': err.message });
    }
}



module.exports = {
    removeAllSets,
    getWorkoutSets,
    getExerciseSets,
    updateSets,
}