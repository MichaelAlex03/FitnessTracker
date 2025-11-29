const pg = require('../../model/sql');

const getWorkoutTemplates = async (req, res) => {
    try {
        const templates = await pg.getWorkoutTemplates();
        const templateExercises = await pg.getTemplateExercises();
        console.log("T", templates, templateExercises)
        res.status(201).json({ templates, templateExercises });
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}



module.exports = { getWorkoutTemplates }