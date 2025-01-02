import { useEffect, useState } from 'react';
import axios from '../api/axios';

const fetchWorkouts = (userId, accessToken) => {

    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchWorkouts = async () => {
            console.log(userId)
            try {
                const response = await axios.get(`/api/workouts/${userId}`,
                    {
                        headers: {
                            'authorization': `Bearer ${accessToken}`
                        }
                    });
                console.log(response)
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
