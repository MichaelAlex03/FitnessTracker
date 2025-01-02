import {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';


export default function History() {

  const location = useLocation();
  const historyInfo = location.state;
  const exerciseName = historyInfo.exercise.exercise_name;
  const userId = historyInfo.userId;
  const accessToken = historyInfo.accessToken
  const decodedExercise = decodeURIComponent(exerciseName);

  const [exerciseHistory, setExerciseHistory] = useState([]);


  useEffect(() => {

      const fetchExerciseHistory = async () => {

        try {
          console.log(userId)
          const result = await axios.get(`http://localhost:3000/api/sets/userExercises/${userId}/${exerciseName}`, {
            headers: {
              'authorization': `Bearer ${accessToken}`
            }
          })

          setExerciseHistory(result.data.sets.rows);

        } catch (error) {
          console.log("failed to retrieve sets");
        }
    
      };
      fetchExerciseHistory();
  },[]);

  return (
    <div className='w-full flex flex-col p-4 items-center justify-center h-screen bg-background'>
        <div className='absolute top-10'>
            <h1  className='text-3xl font-bold mb-2 text'>Previous Sets for {exerciseName}</h1>
            <div className='bg-white rounded-lg'>
              <ul className='divide-y divide-gray-200'>
              {exerciseHistory.map((exercise) => (
                <div key={exercise.id} className='flex justify-between rounded-md p-5'>
                  <p className=''>Reps: {exercise.exercise_reps}</p>
                  <p>Weight: {exercise.exercise_weight}</p>
                </div>
              ))}
              </ul>
            </div>
            
        </div>
    </div>
  )
}
