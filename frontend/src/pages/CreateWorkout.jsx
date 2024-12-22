import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';



export default function CreateWorkout() {
    const location = useLocation();
    const userInfo = location.state
    const accessToken = location.state.accessToken;
    const userId = location.state.id;

    const navigate = useNavigate();
    const [workoutName, setWorkoutName] = useState('');

    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);

    const [errMsg, setErrMsg] = useState('');

    const navigateToWorkoutPage = () => {
        navigate('/workout', { state: userInfo });
    };

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/exercises', {
                    headers: {
                        'authorization': `Bearer ${accessToken}`
                    }
                });
                setExercises(response.data.rows);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        fetchExercises();
    }, []);

    function handleWorkoutChange(event) {
        console.log(event)
        const { value } = event.target
        setSelectedExercise(value)
    }

    function handleAddExercise() {
        if (selectedExercise && !selectedExercises.includes(selectedExercise)) {
            setSelectedExercises([...selectedExercises, selectedExercise])
        }
    }

    function handleRemoveExercise(exerciseToRemove) {
        setSelectedExercises(selectedExercises.filter(exercise => exercise !== exerciseToRemove));
    };

    function handleChange(e) {
        const { value } = e.target
        setWorkoutName(value)
    }

    console.log(selectedExercises)

    async function handleCreateWorkout() {
        try {

            const workoutResponse = await axios.post('http://localhost:3000/api/workouts', {
                workoutName,
                userId,
                selectedExercises,
            }, {
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
            console.log(workoutResponse)
            navigate('/workout', { state: userInfo });
            // if (workoutResponse.data.success) {
            //     const workout_id = workoutResponse.data.workout_id;

            //     const exercisesData = selectedExercises.map(exercise => ({
            //         workout_id: workout_id,
            //         exercise_name: exercise,
            //         sets: 0
            //     }));

            //     console.log(exercisesData);
            //     const exercisesResponse = await axios.post('http://localhost:3000/create_exercises', {
            //         exercises: exercisesData
            //     }, {
            //         headers: {
            //             'Authorization': `Bearer ${accessToken}`
            //         }
            //     });
            //     if (exercisesResponse.data.success) {
            //         navigateToWorkoutPage();
            //     } else {
            //         console.log('Error adding exercises to user_exercises table');
            //     }
            // } else {
            //     console.log('Error creating workout');
            // }
            // console.log(workoutResponse)
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400 && !workoutName) {
                setErrMsg('Did not enter a workout name')
            } else if (err.response?.status === 400 && selectedExercises.length === 0) {
                setErrMsg('Did not select an exercise')
            } else {
                setErrMsg('Workout creation failed');
            }
        }
    }

    return (
        <div className="background">
            <div className="form xl:w-1/2 xl:h-2/3" >
                {errMsg && <p className='bg-pink-300 font-semibold p-2 mb-2 text-red-700' aria-live="assertive">{errMsg}</p>}
                <input className='form--input'
                    type="text"
                    placeholder="Workout Name"
                    name="workoutName"
                    value={workoutName}
                    onChange={handleChange}
                />
                <div className="w-full">
                    <select
                        className="submit rounded bg-gray-300"
                        onChange={handleWorkoutChange}
                    >
                        <option value="">---Add Exercises---</option>
                        {exercises.map(exercise => (
                            <option
                                key={exercise.id}
                                value={exercise.exercise_name}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {exercise.exercise_name}
                            </option>
                        ))}
                    </select>
                    <div className="create-workout">
                        <ul>
                            {selectedExercises.map((exercise, index) => (
                                <li key={index} className="flex justify-between items-center text-lg text-gray-800 py-2 border-b border-gray-300">
                                    {exercise}
                                    <button onClick={() => handleRemoveExercise(exercise)} className="submit delete"><img src="../images/trash.webp" alt="trash" /></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="submit bg-gray-300" onClick={handleAddExercise}>Add</button>
                </div>
                <button className="submit" onClick={handleCreateWorkout}>Create Workout</button>
                <button className="submit" onClick={navigateToWorkoutPage}>Return to Workouts</button>
            </div>
        </div>
    )
}