import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from "react-native-elements";
import { router } from 'expo-router';
import axios, { axiosPrivate } from '@/api/axios';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import useAuth from '@/hooks/useAuth';
import fetchUserInfo from '@/hooks/fetchUserInfo';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UPDATE_URL = '/api/user'
const LOGOUT_URL = '/auth/logout'

const Profile = () => {

  const axiosPrivate = useAxiosPrivate();

  const [refresh, setRefresh] = useState(0);

  const { auth, setAuth } = useAuth();
  const { userInfo, setUserInfo } = fetchUserInfo(refresh, auth?.user, auth?.accessToken)
  console.log(auth)
  console.log(userInfo)

  
  


  const handleLogout = async () => {
    try {
      await axios.get(LOGOUT_URL);
    } catch (error) {
      Alert.alert('Failed logout', 'Failed to logout');
    }
    router.replace('/Login')
  }

  const handleUpdate = async () => {

    const { user_email } = userInfo
    const updateData = {
      name: auth?.user,
      pwd: auth?.pwd,
      email: user_email,
    }

    try {
      await axiosPrivate.patch(UPDATE_URL, {
        updateData
      })
      Alert.alert('Success', 'User Profile Updated')
      setRefresh(refresh + 1);
    } catch (error) {
      Alert.alert('Failed Update', 'Failed to update user info')
    }


  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className='flex-1 p-8 items-center justify-center'>


          {/*Profile Tab Heading*/}
          <View className='w-full'>

            <View className='flex-row justify-between'>
              <Text className='text-white text-4xl font-bold'>Profile</Text>

              <View className='flex-row items-center'>
                <Text className='text-white text-lg mr-2'>Logout</Text>
                <MaterialIcons name="logout" size={24} color="white" onPress={handleLogout} />
              </View>
            </View>

            {/*Profile icon w/ name*/}
            <View className='items-center mt-7 gap-2'>
              <Avatar
                rounded
                size={"medium"}
                icon={{ name: 'user', type: 'font-awesome' }}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
                containerStyle={{ backgroundColor: 'gray' }}
              />
              <Text className='text-white text-2xl font-bold'>{auth?.user}</Text>
            </View>

          </View>

          {/*Profile Tab Content*/}
          <View className='flex-1 items-center mt-10'>

            <FormField
              title={'Current Name'}
              placeholder={auth?.user}
            />

            <FormField
              title={'Change Password'}
              otherStyles={'mt-4'}
              value={auth?.pwd}
              handleChangeText={(text) => setAuth({ ...auth, pwd: text })}
            />

            <FormField
              title={'Current Email'}
              otherStyles={'mt-4'}
              value={userInfo?.user_email}
              handleChangeText={(text) => setUserInfo({ ...userInfo, user_email: text })}
            />

          </View>

          <CustomButton
            title={'Update'}
            containerStyles={'mt-auto'}
            handlePress={handleUpdate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile