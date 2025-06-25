import { useEffect, useState } from 'react'
import useAxiosPrivate from './useAxiosPrivate'

interface FetchProps {
    refresh: number
    name: string
    accessToken: string
}

interface UserInfo {
    user_name: string
    user_email: string
    user_phone: string
    id: string
    profile_image: string
    profile_image_key: string
}

const fetchUserInfo = ({refresh, name, accessToken}: FetchProps) => {

    const axiosPrivate = useAxiosPrivate();

    const API_URL = `/api/user/${name}`
    const [userInfo, setUserInfo] = useState<UserInfo[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axiosPrivate.get(API_URL);
                console.log(result.data.userInfo)
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