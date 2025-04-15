import axios from '../api/axios';
import useAuth from './useAuth';


const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        })
        setAuth({
            ...auth,
            accessToken: response.data.accessToken,
            user: response.data.user
        })

        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken