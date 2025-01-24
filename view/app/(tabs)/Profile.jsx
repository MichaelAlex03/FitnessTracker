import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from "react-native-elements";
import { router } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'



const Profile = () => {

  const handleLogout = () => {
    router.replace('/Login')
  }

  const handleUpdate = () => {

  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full p-8 h-full'>

          {/*Profile Tab Heading*/}
          <View>

            <View className='flex-row'>
              <Text className='text-white text-4xl font-bold mr-auto'>Profile</Text>

              <View className='flex-row items-center'>
                <Text className='text-white text-lg mr-2'>Logout</Text>
                <MaterialIcons name="logout" size={24} color="white" onPress={handleLogout}/>
              </View>
            </View>

            {/*Profile icon w/ name*/}
            <View className='flex-row items-center mt-7'>
              <Avatar
                rounded
                size={"medium"}
                icon={{ name: 'user', type: 'font-awesome' }}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
                containerStyle={{ backgroundColor: 'gray', marginRight: 10}}
              />
              <Text className='text-white text-xl'>Michael Lleverino</Text>
            </View>

          </View>

          {/*Profile Tab Content*/}
          <View className='mt-6'>

            <FormField
              title={'Name'}
              otherStyles={'mt-4'}
            />

            <FormField
              title={'Change Password'}
              otherStyles={'mt-4'}
            />

            <FormField
              title={'Change Password'}
              otherStyles={'mt-4'}
            />

          </View>

          <CustomButton
              title={'Update'}
              containerStyles={'mt-auto'}
              handlePress={() => {}}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile