const db = require('.././config/dbConn');

const findUser = async (user) => {
    return await db.query('SELECT * FROM users WHERE user_name = $1', [user])
}

const updateUser = async (refreshToken, user) => {
    return await db.query('UPDATE users SET refresh_token = $1 WHERE user_name = $2', [refreshToken, user])
}

const createUser = async (user, pwd) => {
    return await db.query('INSERT INTO users (user_name, user_pass) VALUES( $1, $2)', [user, pwd]);
}

const getWorkouts = (userId) => {
    return db.query('SELECT * FROM workouts WHERE user_id = $1', [userId]);
}

const getAllExercises = async () => {
    return await db.query('SELECT * FROM exercises');
}

const getWorkoutExercises = async (workoutId) => {
    return await db.query('SELECT * FROM user_exercises WHERE workout_id = $1', [workoutId]);
}

const createWorkout = async (workoutName, userId) => {
    return await db.query('INSERT INTO workouts (workout_name, user_id) VALUES ($1, $2) RETURNING *', [workoutName, userId]);
}

const createWorkoutExercises = async (workoutId, selectedExercises) => {
    try {
        selectedExercises.map(async (exercise) => {
            const ex = await db.query('INSERT INTO user_exercises (exercise_name, workout_id) VALUES ($1, $2) RETURNING *', [exercise, workoutId]);
            createSet(ex);
        });
        return true;
    } catch (err) {
        return err;
    }
}

const createSet = async (exercise) => {
    return await db.query('INSERT INTO workout_sets (exercise_id, exercise_reps, exercise_weight, workout_id) VALUES ($1, $2, $3, $4)',
        [exercise.rows[0].id, 0, 0, exercise.rows[0].workout_id]
    )
}

const removeAllSets = async (workoutId) => {
    return await db.query('DELETE FROM workout_sets WHERE workout_id = $1', [workoutId]);
}

const removeAllExercises = async (workoutId) => {
    return await db.query('DELETE FROM user_exercises WHERE workout_id = $1', [workoutId]);
}

const removeWorkout = async (workoutId) => {
    return await db.query('DELETE FROM workouts WHERE id = $1', [workoutId]);
}

module.exports = {
    findUser,
    updateUser,
    createUser,
    getAllExercises,
    getWorkouts,
    createWorkout,
    createWorkoutExercises,
    removeAllSets,
    removeAllExercises,
    removeWorkout,
    getWorkoutExercises
}