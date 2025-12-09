import { useState, useEffect } from 'react';
import useAxiosPrivate from './useAxiosPrivate';
import useAuth from './useAuth';

const WORKOUT_URL = '/api/workouts'

interface Workout {
    id: number,
    workout_name: string,
    user_id: string
}

const usefetchWorkouts = (id: string, refresh: number) => {

    console.log("T", id)
    const axiosPrivate = useAxiosPrivate();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const { trigger } = useAuth();

    useEffect(() => {
        const getWorkouts = async () => {
            try {
                const response = await axiosPrivate.get(`${WORKOUT_URL}/${id}`)
                setWorkouts(response.data.workouts)
            } catch (error) {
                console.error(error)
            }
        }
        getWorkouts();
    }, [refresh, trigger])
    return workouts  
}

export default usefetchWorkouts;