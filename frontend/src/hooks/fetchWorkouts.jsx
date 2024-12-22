import { useEffect, useState } from 'react';
import axios from '../api/axios';

const fetchWorkouts = (userId, accessToken) => {

    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null)

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
                console.log(response);
                setWorkouts(response.data.workouts);
            } catch (error) {
                setError(error);
            }
        };

        fetchWorkouts();
    }, [userId, accessToken]);

    return { workouts, error };
}

export default fetchWorkouts;
