const supabase = require('../config/dbConn');

const updateUser = async (user, refreshToken) => {
    const { data, error } = await supabase
        .from('users')
        .update({ refresh_token: refreshToken })
        .eq('user_name', user);
    if (error) throw error;
    return data;
};

//---------------------------- Patch Routes Queries ------------------------------//

const updateUserProfile = async (prevName, name, phone, email) => {
    const { data, error } = await supabase
        .from('users')
        .update({ user_name: name, user_email: email, user_phone: phone })
        .eq('user_name', prevName);
    if (error) console.log(error);
    return data;
};

const updateSets = async (sets, workoutId) => {

    // Clean refresh before updating sets
    await removeAllSets(workoutId)
    const { data, error } = await supabase
      .from('workout_sets')
      .insert(sets);
    if (error) throw error;
    return data;
  };

const updateWorkout = async (workoutId, workoutName) => {
    const { data, error } = await supabase
        .from('workouts')
        .update({ workout_name: workoutName })
        .eq('id', workoutId)
    if (error) console.log(error);
    return data
}

//---------------------------- Get Routes Queries ------------------------------//
const findUser = async (user) => {
    console.log(user)
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_name', user);
    if (error) throw error;
    return data;
};

const findUserSecure = async (user) => {
    const { data, error } = await supabase
        .from('users')
        .select('user_name, user_email, id, user_phone')
        .eq('user_name', user);
    if (error) throw error;
    return data;
};

const findRefreshToken = async (refreshToken) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('refresh_token', refreshToken);
    if (error) throw error;
    return data;
};

const getWorkouts = async (id) => {
    const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', id);
    if (error) throw error;
    return data;
};

const getAllExercises = async () => {
    const { data, error } = await supabase
        .from('exercises')
        .select('*');
    if (error) throw error;
    return data;
};

const getWorkoutExercises = async (workoutId) => {
    const { data, error } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('workout_id', workoutId);
    if (error) throw error;
    return data;
};

const getWorkoutSets = async (workoutId) => {
    const { data, error } = await supabase
        .from('workout_sets')
        .select('*')
        .eq('workout_id', workoutId);
    if (error) throw error;
    return data;
};

const getAllSetsForExercise = async (userId, exerciseName) => {
    const { data, error } = await supabase
        .from('workout_sets')
        .select(`
            workout_sets.*,
            workouts!inner(user_id),
            user_exercises!inner(exercise_name)
        `)
        .eq('workouts.user_id', userId)
        .eq('user_exercises.exercise_name', exerciseName);
    if (error) throw error;
    return data;
};

//---------------------------- Post Routes Queries ------------------------------//

const createUser = async (user, pwd) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ user_name: user, user_pass: pwd }]);
    if (error) throw error;
    return data;
};

const createWorkout = async (workoutName, userId) => {
    const { data, error } = await supabase
        .from('workouts')
        .insert([{ workout_name: workoutName, user_id: userId }])
        .select()
        .single();
    if (error) throw error;
    return data;
};

const createWorkoutExercises = async (workoutId, selectedExercises) => {
    try {
        selectedExercises.map(async (exercise) => {
            const { data, error } = await supabase
                .from('user_exercises')
                .insert([{ exercise_name: exercise.exercise_name, workout_id: workoutId }])
                .select()
                .single();
            if (error) throw error;
            await createSet(data);
        });
        return true;
    } catch (err) {
        return err;
    }
};

//This function used when workout is initially created. 
const createSet = async (exercise) => {
    const { data, error } = await supabase
        .from('workout_sets')
        .insert([{ exercise_id: exercise.id, exercise_reps: 0, exercise_weight: 0, workout_id: exercise.workout_id }]);
    if (error) {
        console.log(error)
        throw error
    };
    return data;
};

const addSetsToHistory = async (sets) => {
    const { data, error } = await supabase
        .from('sets_history')
        .insert(sets)
    if (error) throw error;
    return data
}


//---------------------------- Delete Routes Queries ------------------------------//

const removeAllSets = async (workoutId) => {
    const { data, error } = await supabase
        .from('workout_sets')
        .delete()
        .eq('workout_id', workoutId);
    if (error) throw error;
    return data;
};

const removeAllExercises = async (workoutId) => {
    const { data, error } = await supabase
        .from('user_exercises')
        .delete()
        .eq('workout_id', workoutId);
    if (error) throw error;
    return data;
};

const removeWorkout = async (workoutId) => {
    const { data, error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);
    if (error) throw error;
    return data;
};

const deleteSet = async (setId) => {
    const { data, error } = await supabase
        .from('workout_sets')
        .delete()
        .eq('id', setId);
    if (error) throw error;
    return data;
};

const deleteExercise = async (exerciseId) => {
    try {
        const { data: setsData, error: setsError } = await supabase
            .from('workout_sets')
            .delete()
            .eq('exercise_id', exerciseId);
        if (setsError) throw setsError;

        const { data: exerciseData, error: exerciseError } = await supabase
            .from('user_exercises')
            .delete()
            .eq('id', exerciseId);
        if (exerciseError) throw exerciseError;

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
    updateUserProfile,
    createUser,
    getAllExercises,
    getAllSetsForExercise,
    getWorkouts,
    createWorkout,
    createWorkoutExercises,
    addSetsToHistory,
    removeAllSets,
    removeAllExercises,
    removeWorkout,
    getWorkoutExercises,
    getWorkoutSets,
    deleteSet,
    deleteExercise,
    updateSets,
    updateWorkout
}