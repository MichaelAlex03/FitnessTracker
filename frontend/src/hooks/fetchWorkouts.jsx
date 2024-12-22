import { useEffect, useState } from 'react';
import axios from '../api/axios';

const fetchWorkouts = () => {

    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/workouts${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setWorkouts(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchWorkouts();
    }, [userId, accessToken]);

    return { workouts, error };
}

export default fetchWorkouts;
