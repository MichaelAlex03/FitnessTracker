import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from "react-native-elements";
import { router } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import useAuth from '@/hooks/useAuth';

const Profile = () => {

  const { auth } = useAuth();
  console.log(auth)

  const handleLogout = () => {
    router.replace('/Login')
  }

  const handleUpdate = () => {

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
            />

            <FormField
              title={'Current Email'}
              otherStyles={'mt-4'}
            />

          </View>

          <CustomButton
            title={'Update'}
            containerStyles={'mt-auto'}
            handlePress={() => { }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile