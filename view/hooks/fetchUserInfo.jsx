import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '@/api/axios'

const fetchUserInfo = (refresh, name, accessToken) => {

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

    return userInfo;
}

export default fetchUserInfo