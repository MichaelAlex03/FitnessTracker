const pg = require('../../model/sql')

const createSet = async (req, res) => {
    const { exercise, workoutId } = req.body;
    try {
        const result = await pg.addSet(exercise, workoutId);
        console.log(result)
        return res.status(201).json({ 'message': 'set created!' });
    }
    catch (err) {
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
    createSet
}