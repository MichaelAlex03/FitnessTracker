import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import fetchWorkouts from '../hooks/fetchWorkouts';
import axios from 'axios';


export default function WorkoutPage() {
    //retrieving userInfo needed to send to backend
    const location = useLocation();
    const userInfo = location.state
    const accessToken = location.state.accessToken;
    const userId = location.state.id;


    const navigate = useNavigate();

    //Retrieves workouts for given id. Reruns everytime userId changes or accessToken changes
    const { workouts, error } = fetchWorkouts(userId, accessToken);

    const navigateToCreateWorkout = () => {
        navigate('/create-workout', { state: userInfo });
    };



    const navigateToWorkoutView = (id) => {
        navigate(`/workout--view/${id}`);
    };

    const navigateToWelcome = () => {
        navigate('/')
    }



    async function removeWorkout(workoutToRemove) {
        setWorkouts(workouts.filter(workout => workout !== workoutToRemove));

        console.log(workoutToRemove.id);
        try {
            const deleteSets = await axios.delete(`http://localhost:3000/workout_sets/${workoutToRemove.id}`);
            console.log(deleteSets.data);
            if (deleteSets.data.success) {
                const deleteExercises = await axios.delete(`http://localhost:3000/workout_exercises/${workoutToRemove.id}`);
                console.log(deleteExercises.data)
                if (deleteExercises.data.success) {
                    const deleteWorkout = await axios.delete(`http://localhost:3000/workouts/${workoutToRemove.id}`);
                    console.log(deleteWorkout.data)
                }
            } else {
                console.log("could not delete sets");
            }
        }
        catch (error) {
            console.error('Error deleting workout:', error);
        }

    }

    console.log(workouts)

    return (
        <div className="background">
            <div className="relative content flex flex-col bg-black bg-opacity-60">
                <h1 className="absolute top-5 left-5 text-2xl font-bold text-white">My Workouts</h1>
                <button className=" absolute submit top-24 w-5/6" onClick={navigateToCreateWorkout}>Create a new workout</button>
                <div className="flex flex-col items-center mt-24 w-full overflow-y-auto max-h-[450px]">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="flex w-5/6 mb-2 gap-2">
                            <button key={workout.id} className="workouts flex-grow" onClick={() => navigateToWorkoutView(workout.id)}>{workout.workout_name}</button>
                            <button key={workout.workout_name} onClick={() => removeWorkout(workout)} className="workouts delete w-12 h-12 flex items-center justify-center"><img src="../images/trash.webp" alt="trash" className='w-6 h-6' /></button>
                        </div>
                    ))}
                </div>
                <button className='submit bg-gray-300 w-1/2 absolute bottom-4 left-1/2 transform -translate-x-1/2' onClick={navigateToWelcome}>Sign out</button>
            </div>
        </div>
    )
}