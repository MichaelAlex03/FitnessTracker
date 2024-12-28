const pg = require('../../model/sql')

const addSet = async (req, res) => {

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
    getWorkoutSets
}