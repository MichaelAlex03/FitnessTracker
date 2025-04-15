import { useState, useEffect } from 'react';
import useAxiosPrivate from './useAxiosPrivate';

const WORKOUT_URL = '/api/workouts'

const fetchWorkouts = (id: string) => {

    const axiosPrivate = useAxiosPrivate();
    const [workouts, setWorkouts] = useState([]);

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

export default fetchWorkouts;