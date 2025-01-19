import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const reponse = await axios.get('/auth/refresh', {
            withCredentials: true
        })
        setAuth(prev => (
            {
                ...prev,
                accessToken: response.data.accessToken
            }
        ))

        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken