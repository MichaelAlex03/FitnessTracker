import { useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate'

const fetchUserInfo = (refresh, name, accessToken) => {

    const axiosPrivate = useAxiosPrivate();

    const API_URL = `/api/user/${name}`
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axiosPrivate.get(API_URL);
                setUserInfo(result.data.userInfo)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUser();
    }, [refresh, accessToken])
    return { userInfo, setUserInfo };
}

export default fetchUserInfo