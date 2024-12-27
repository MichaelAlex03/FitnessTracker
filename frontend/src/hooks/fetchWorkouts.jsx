import { useEffect, useState } from 'react';
import axios from '../api/axios';

const fetchWorkouts = (userId, accessToken) => {

    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null)
    const [workoutId, setWorkoutId] = useState();
    

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(`/api/workouts/`, {
                    params: {
                        userId: userId,
                    },
                    headers: {
                        'authorization': `Bearer ${accessToken}`
                    }
            });
                setWorkouts(response.data.workouts);
            } catch (error) {
                setError(error);
            }
        };

        fetchWorkouts();
    }, [userId, accessToken]);

    return { workouts, error, setWorkouts };
}

export default fetchWorkouts;
