import { useState, useEffect } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const WORKOUT_URL = '/api/workouts'

interface Workout {
    id: number,
    exercise_name: string,
    user_id: string
}

const usefetchWorkouts = (id: string) => {

    console.log(id)
    const axiosPrivate = useAxiosPrivate();
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        const getWorkouts = async () => {
            try {
                const response = await axiosPrivate.get(`${WORKOUT_URL}/${id}`)
                console.log('Workouts', response.data.workouts)
                setWorkouts(response.data.workouts)
            } catch (error) {
                console.error(error)
            }
        }
        getWorkouts();
    }, [])
    return workouts  
}

export default usefetchWorkouts;