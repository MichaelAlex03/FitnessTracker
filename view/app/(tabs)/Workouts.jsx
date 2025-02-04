import { Text, ScrollView, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchUserInfo from '@/hooks/fetchUserInfo'
import fetchWorkouts from '@/hooks/fetchWorkouts'
import useAuth from '@/hooks/useAuth'

const Workouts = () => {
  const [refresh, setRefresh] = useState(0);

  const { auth, setAuth } = useAuth();
  const { userInfo, setUserInfo } = fetchUserInfo(refresh, auth?.user, auth?.accessToken);

  useEffect(() => {
    if (!auth?.id && userInfo?.id) {
      Promise.resolve().then(() => {
        setAuth((prevAuth) => ({
          ...prevAuth,
          id: userInfo.id,
        }));
      });
    }
  }, []); 

  fetchWorkouts()





  return (
    <SafeAreaView className="bg-primary flex-1">

      <FlatList
        ListHeaderComponent={() => (
          <View className='flex-1 p-5'>

            <View className='mb-10'>
              <Text className='font-bold text-md text-gray-100'>Welcome Back</Text>
              <Text className='text-white font-semibold text-3xl'>{auth?.user}</Text>
            </View>

            <Text className='text-white font-semibold text-4xl'>Start Workout</Text>
          </View>
        )}

      />

    </SafeAreaView>
  )
}

export default Workouts