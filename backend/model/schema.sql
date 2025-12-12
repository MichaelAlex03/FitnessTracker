-- Executable database schema for fitness tracker
-- Tables are ordered by dependencies to ensure successful execution

-- Base table with no dependencies
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_pass text,
  user_email text UNIQUE,
  user_phone text UNIQUE,
  refresh_token text,
  profile_image text,
  profile_image_key text,
  paid_user boolean DEFAULT false,
  user_verified boolean DEFAULT false,
  verification_code bigint,
  verification_code_expiration timestamp with time zone,
  created_at timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Base table with no dependencies
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  workout_name text,
  CONSTRAINT workout_templates_pkey PRIMARY KEY (id)
);

-- Depends on: users
CREATE TABLE IF NOT EXISTS public.workouts (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  workout_name text NOT NULL,
  user_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT workouts_pkey PRIMARY KEY (id),
  CONSTRAINT workouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Depends on: users
CREATE TABLE IF NOT EXISTS public.workout_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  workout_name text,
  user_id uuid DEFAULT gen_random_uuid(),
  time_elapsed integer,
  CONSTRAINT workout_history_pkey PRIMARY KEY (id),
  CONSTRAINT workout_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Depends on: users
CREATE TABLE IF NOT EXISTS public.exercises (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  exercise_name text NOT NULL,
  exercise_instructions text,
  exercise_bodypart text,
  exercise_category text,
  user_id uuid,
  CONSTRAINT exercises_pkey PRIMARY KEY (id),
  CONSTRAINT exercises_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Depends on: workouts
CREATE TABLE IF NOT EXISTS public.user_exercises (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  exercise_name text NOT NULL,
  workout_id bigint,
  CONSTRAINT user_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT user_exercises_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE
);

-- Depends on: workout_templates
CREATE TABLE IF NOT EXISTS public.workout_template_exercises (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  exercise_name text,
  workout_template_id bigint,
  CONSTRAINT workout_template_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT workout_template_exercises_workout_template_id_fkey FOREIGN KEY (workout_template_id) REFERENCES public.workout_templates(id) ON DELETE CASCADE
);

-- Depends on: users, workout_history
CREATE TABLE IF NOT EXISTS public.exercise_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  exercise_name text NOT NULL,
  workout_id bigint,
  user_id uuid,
  CONSTRAINT exercise_history_pkey PRIMARY KEY (id),
  CONSTRAINT exercise_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT exercise_history_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workout_history(id) ON DELETE CASCADE
);

-- Depends on: user_exercises, workouts
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exercise_id integer NOT NULL,
  exercise_reps smallint NOT NULL DEFAULT '0'::smallint,
  exercise_weight smallint DEFAULT '0'::smallint,
  workout_id integer,
  set_type text,
  CONSTRAINT workout_sets_pkey PRIMARY KEY (id),
  CONSTRAINT workout_sets_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.user_exercises(id) ON DELETE CASCADE,
  CONSTRAINT workout_sets_workout_id_fkey FOREIGN KEY (workout_id) REFERENCES public.workouts(id) ON DELETE CASCADE
);

-- Depends on: users, exercise_history
CREATE TABLE IF NOT EXISTS public.sets_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exercise_id integer,
  exercise_reps smallint,
  exercise_weight smallint,
  workout_id integer,
  set_type text,
  user_id uuid,
  exercise_name text,
  created_at timestamp with time zone,
  CONSTRAINT sets_history_pkey PRIMARY KEY (id),
  CONSTRAINT sets_history_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercise_history(id) ON DELETE CASCADE,
  CONSTRAINT sets_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);