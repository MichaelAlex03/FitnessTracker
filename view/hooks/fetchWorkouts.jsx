import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';

const WORKOUT_URL = '/api/workouts'

const fetchWorkouts = () => {

    const axiosPrivate = useAxiosPrivate();
    const [workouts, setWorkouts] = useState([]);

    const { auth, setAuth } = useAuth();
    console.log('Auth' , auth)

    useEffect(() => {
        const getWorkouts = async () => {
            try {
                const response = await axiosPrivate.get(WORKOUT_URL + `/${auth.user}`)
                console.log(response)
            } catch (error) {
                console.error(error)
            }
        }
        getWorkouts();
    })
    return workouts
}

export default fetchWorkouts;