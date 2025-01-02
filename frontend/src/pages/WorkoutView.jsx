import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/Dropdown/Dropdown';
import DropdownItem from '../components/DropdownItem/DropdownItem';
import RenderSets from '../components/RenderSets';

export default function WorkoutView() {

    const location = useLocation();
    const userInfo = location.state
    const accessToken = location.state.accessToken;
    const userId = location.state.userId;
    const workoutId = location.state.workoutId


    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [exerciseSets, setExerciseSets] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [toggleAddExercise, setToggleAddExercise] = useState(false);
    const [refreshSet, setRefreshSet] = useState(0);
    const [addSet, setAddSet] = useState(0);
    const [deleteSet, setDeleteSet] = useState(0);
    const [setId, setSetId] = useState(0);
    const [refreshExercise, setRefreshExercise] = useState(0);

    const options = ["Delete Exercise", "View Exercise History"];


    /* Retrieves exercises for the workout */
    useEffect(() => {
        const fetchExercises = async () => {

            try {
                const exerciseData = await axios.get(`http://localhost:3000/api/exercises/getWorkoutExercises/${workoutId}`, {
                    headers: {
                        'authorization': `Bearer ${accessToken}`
                    }
                });

                setExercises(exerciseData.data.exercises);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        fetchExercises();
    }, [refreshExercise]);

    /* Retrieves sets for the workout */
    useEffect(() => {
        const fetchSets = async () => {
            try {
                const setsData = await axios.get(`http://localhost:3000/api/sets/getAllSets/${workoutId}`, {
                    headers: {
                        'authorization': `Bearer ${accessToken}`
                    }
                });
                setExerciseSets(setsData.data.sets);
            } catch (error) {
                console.error('Error fetching sets:', error);
            }
        }
        fetchSets();
    }, [refreshSet]);


    const handleAddSet = async(exercise) => {
        try {
            await axios.post('http://localhost:3000/api/sets', {
                exercise,
                workoutId,
            }, {
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
            setRefreshSet(prevRefreshSet => prevRefreshSet + 1)
        } catch (error) {
            console.error('Error adding set', error);
        }
    }

    const handleDeleteSet = async (setId) => {
        try {
            await axios.delete(`http://localhost:3000/api/sets/deleteSet/${setId}`, {
                headers: { 'authorization': `Bearer ${accessToken}` },
            });
            setRefreshSet(prevRefreshSet => prevRefreshSet + 1)
        } catch (error) {
            console.error("Failed to delete set:", error);
        }
    }


    /* Handles dropdown menu onClick */
    const handleOptionClick = async (option, exercise) => {
        const historyInfo = {
            exercise,
            userId,
            accessToken,
        }
        if (option === 'View Exercise History') {
            navigate('/workoutHistory', { state: historyInfo });
        }
        else if (option === 'Delete Exercise') {
            try {
                await axios.delete(`http://localhost:3000/api/exercises/delete/${exercise.id}`, {
                    headers: {
                        'authorization': `Bearer ${accessToken}`
                    }
                });
                setRefreshExercise(prevRefreshExercise => prevRefreshExercise - 1);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className="w-full flex flex-col p-4 items-center justify-center h-screen bg-background">
            <div className="content xs:w-5/6 lg:w-1/2">
                <div className='max-h-[100vh] overflow-y-auto flex flex-col items-center'>
                    {exercises.map((exercise) => {
                        const exerciseSetsFiltered = exerciseSets.filter(set => set.exercise_id === exercise.id);
                        return (
                            <div key={exercise.id} className="mb-8 p-4 border rounded bg-gray-50  xs:w-5/6">
                                <div className='flex mb-4'>
                                    <h2 className="text-xl font-semibold mb-4 mr-auto">{exercise.exercise_name}</h2>
                                    <Dropdown buttonText="..."
                                        content={<>
                                            {options.map(option => (
                                                <DropdownItem key={option} onClick={() => handleOptionClick(option, exercise)}>
                                                    {option}
                                                </DropdownItem>
                                            ))}
                                        </>
                                        } />
                                </div>
                                <RenderSets
                                    sets={exerciseSetsFiltered}
                                    accessToken={accessToken}
                                    handleAddSet={handleAddSet}
                                    handleDeleteSet={handleDeleteSet}
                                />
                                <button className="submit mt-4 p-1" onClick={() => handleAddSet(exercise)}>Add Set</button>
                            </div>
                        );
                    })}
                </div>
                <button className='submit mt-2' >Add Exercise</button>
                <select className="submit rounded bg-gray-300">
                    {toggleAddExercise && workouts.map((workout) => (
                        <option key={workout.id} onClick={() => addExercise(workout)}>{workout.exercise_name}</option>
                    ))}
                </select>
                <button className='submit'>Finish Workout</button>
                <button className="submit bg-gray-300">Return to Workouts</button>
            </div>
        </div>
    )
}
