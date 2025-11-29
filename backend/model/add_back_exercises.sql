-- SQL Script to add Lat Pulldown and Seated Cable Row exercises
-- These are default exercises (user_id is NULL) available to all users

-- Insert Lat Pulldown
INSERT INTO exercises (exercise_name, exercise_category, exercise_bodypart, exercise_instructions, user_id)
VALUES (
    'Lat Pulldown',
    'Machine',
    'Back',
    'Step 1: Sit down at a lat pulldown machine and adjust the knee pad to fit snugly against your legs
Step 2: Reach up and grasp the bar with a wide grip, palms facing forward
Step 3: Keep your torso upright and core engaged throughout the movement
Step 4: Pull the bar down towards your upper chest by driving your elbows down and back
Step 5: Squeeze your shoulder blades together at the bottom of the movement
Step 6: Slowly return the bar to the starting position with control
Step 7: Repeat for the desired number of repetitions',
    NULL
);

-- Insert Seated Cable Row
INSERT INTO exercises (exercise_name, exercise_category, exercise_bodypart, exercise_instructions, user_id)
VALUES (
    'Seated Cable Row',
    'Machine',
    'Back',
    'Step 1: Sit at a cable row machine with your feet on the footplates and knees slightly bent
Step 2: Grasp the handle or bar with both hands, keeping your arms extended
Step 3: Keep your back straight and chest up, engaging your core
Step 4: Pull the handle towards your torso, driving your elbows back past your sides
Step 5: Squeeze your shoulder blades together at the end of the pull
Step 6: Focus on pulling with your back muscles, not just your arms
Step 7: Slowly extend your arms back to the starting position with control
Step 8: Repeat for the desired number of repetitions',
    NULL
);