import axios from '../api/axios';
import useAuth from './useAuth';
import * as SecureStore from 'expo-secure-store';


const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        console.log("REFRESH", refreshToken)

        const response = await axios.post('/auth/refresh', {
            refreshToken
        });
        setAuth({
            ...auth,
            accessToken: response.data.accessToken,
            user: response.data.user,
            userId: response.data.id,
            email: response.data.email
        })

        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken