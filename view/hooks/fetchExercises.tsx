import React, { useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate';
import useAuth from './useAuth';

interface Exercise {
    exercise_name: string,
    exercise_bodypart: string,
    exercise_category: string
    exercise_instructions: string,
    user_id: string,
    id: string
}


const EXERCISES_URL = '/api/exercises';

const fetchExercises = () => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        const getExercises = async () => {
            try {
                const response = await axiosPrivate.get(`${EXERCISES_URL}/${auth.userId}`);
                setExercises(response.data.exercises)
            } catch (error) {
                console.error(error)
            }
        }
        getExercises();
    }, [])

    return { exercises }
}

export default fetchExercises