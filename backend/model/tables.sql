-- Users table
CREATE TABLE users (
    id NOT NULL PRIMARY KEY,
    user_name TEXT,
    user_pass TEXT,
    refresh_token TEXT
);

--Workouts table
CREATE TABLE workouts (
    id NOT NULL PRIMARY KEY,
    workout_name TEXT,
    user_id FOREIGN KEY REFERENCES users(id),
);

--User exercises table
CREATE TABLE user_exercises (
    id NOT NULL PRIMARY KEY,
    exercise_name TEXT,
    workout_id FOREIGN KEY REFERENCES workouts(id)
);

--Workout sets table
CREATE TABLE workout_sets (
    id NOT NULL PRIMARY KEY,
    exercise_id INT,
    exercise_reps INT,
    exercise_weight INT,
    workout_id FOREIGN KEY REFERENCES workouts(id)
);

--Exercises table (List of exercises to choose from)
CREATE TABLE exercises (
    id PRIMARY KEY,
    exercise_name TEXT,
)