import React, { useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate';

interface Exercise {
    exercise_name: string,
    exercise_category: string,
    exercise_instructions: string,
    id: string
}


const EXERCISES_URL = '/api/exercises';

const fetchExercises = () => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getExercises = async () => {
            try {
                const response = await axiosPrivate.get(EXERCISES_URL)
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