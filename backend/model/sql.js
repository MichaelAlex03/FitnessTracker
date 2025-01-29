const db = require('.././config/dbConn');

const updateUser = async (user, refreshToken) => {
    return await db.query('UPDATE users SET refresh_token = $1 WHERE user_name = $2', [refreshToken, user]);
};

const updateSets = async (sets) => {
    sets.map(set => {
        return db.query(
            'UPDATE workout_sets SET exercise_reps = $1, exercise_weight = $2 WHERE id = $3', [set.exercise_reps, set.exercise_weight, set.id]
        );
    });
};

//---------------------------- Get Routes Queries ------------------------------//
const findUser = async (user) => {
    return await db.query('SELECT * FROM users WHERE user_name = $1', [user]);
};

const findUserSecure = async (user) => {
    return await db.query('SELECT user_name, user_email FROM users WHERE user_name = $1', [user]);
};

const findRefreshToken = async (refreshToken) => {
    return await db.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
};

const getWorkouts = (userId) => {
    console.log(userId)
    return db.query('SELECT * FROM workouts WHERE user_id = $1', [userId]);
};

const getAllExercises = async () => {
    return await db.query('SELECT * FROM exercises');
};

const getWorkoutExercises = async (workoutId) => {
    return await db.query('SELECT * FROM user_exercises WHERE workout_id = $1', [workoutId]);
};

const getWorkoutSets = async (workoutId) => {
    return await db.query('SELECT * FROM workout_sets WHERE workout_id = $1', [workoutId]);
};

const getAllSetsForExercise = async (userId, exerciseName) => {
    return await db.query(
        `
        SELECT 
            workout_sets.*
        FROM 
            workouts
        JOIN 
            user_exercises 
            ON workouts.id = user_exercises.workout_id
        JOIN 
            workout_sets 
            ON user_exercises.id = workout_sets.exercise_id
        WHERE 
            workouts.user_id = $1 
            AND user_exercises.exercise_name = $2
        `,
        [userId, exerciseName]
    );
};


//---------------------------- Post Routes Queries ------------------------------//

const createUser = async (user, pwd) => {
    return await db.query('INSERT INTO users (user_name, user_pass) VALUES( $1, $2)', [user, pwd]);
};

const createWorkout = async (workoutName, userId) => {
    return await db.query('INSERT INTO workouts (workout_name, user_id) VALUES ($1, $2) RETURNING *', [workoutName, userId]);
};

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
};

//This function used when workout is initially created. addSet is used for all future set creations
const createSet = async (exercise) => {
    return await db.query('INSERT INTO workout_sets (exercise_id, exercise_reps, exercise_weight, workout_id) VALUES ($1, $2, $3, $4)',
        [exercise.rows[0].id, 0, 0, exercise.rows[0].workout_id]
    );
};

const addSet = async (exercise, workoutId) => {
    return await db.query('INSERT INTO workout_sets (exercise_id, exercise_reps, exercise_weight, workout_id) VALUES ($1, $2, $3, $4)',
        [exercise.id, 0, 0, workoutId]
    );
};

//---------------------------- Delete Routes Queries ------------------------------//

const removeAllSets = async (workoutId) => {
    return await db.query('DELETE FROM workout_sets WHERE workout_id = $1', [workoutId]);
};

const removeAllExercises = async (workoutId) => {
    return await db.query('DELETE FROM user_exercises WHERE workout_id = $1', [workoutId]);
};

const removeWorkout = async (workoutId) => {
    return await db.query('DELETE FROM workouts WHERE id = $1', [workoutId]);
};

const deleteSet = async (setId) => {
    return await db.query('DELETE FROM workout_sets WHERE id = $1', [setId]);
};

const deleteExercise = async (exerciseId) => {
    try {
        await db.query('DELETE FROM workout_sets WHERE exercise_id = $1', [exerciseId]); //need to delete sets before exercise since they are linked to exercise
        await db.query('DELETE FROM user_exercises WHERE id = $1', [exerciseId]);
        return true;
    } catch (err) {
        return err;
    }
};

//Exports

module.exports = {
    findUser,
    findUserSecure,
    findRefreshToken,
    updateUser,
    createUser,
    getAllExercises,
    getAllSetsForExercise,
    getWorkouts,
    createWorkout,
    createWorkoutExercises,
    removeAllSets,
    removeAllExercises,
    removeWorkout,
    getWorkoutExercises,
    getWorkoutSets,
    addSet,
    deleteSet,
    deleteExercise,
    updateSets
}