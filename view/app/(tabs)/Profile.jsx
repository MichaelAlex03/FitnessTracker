import { View, Text, ScrollView, Alert, StatusBar, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from "react-native-elements";
import { router } from 'expo-router';
import axios, { axiosPrivate } from '@/api/axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import useAuth from '@/hooks/useAuth';
import fetchUserInfo from '@/hooks/fetchUserInfo';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UPDATE_URL = '/api/user'
const LOGOUT_URL = '/auth/logout'
const PHONE_REGEX = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const Profile = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const [refresh, setRefresh] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  //Fetch current user
  const { userInfo } = fetchUserInfo(refresh, auth?.user, auth?.accessToken);

  //Use useEffect to set state due to asnyc nature
  useEffect(() => {
    if (userInfo && userInfo.length > 0) {
      setName(userInfo[0]?.user_name || '');
      setEmail(userInfo[0]?.user_email || '');
      setPhone(userInfo[0]?.user_phone || '');
      console.log("Setting user info to state:", userInfo);
    }
  }, [userInfo]);

  //Reset State when pressing cancel
  const handleCancel = () => {
    setName(userInfo[0]?.user_name || '');
    setEmail(userInfo[0]?.user_email || '');
    setPhone(userInfo[0]?.user_phone || '');
    setIsEdit(false);
  }


  const handleLogout = async () => {
    try {
      await axios.get(LOGOUT_URL);
      Alert.alert('Signed Out', 'Sign out was succesful')
    } catch (error) {
      Alert.alert('Failed logout', 'Failed to logout');
    }
    router.replace('/Login')
  }

  const handleUpdate = async () => {

    //Validate phone number
    console.log(!PHONE_REGEX.test(phone), "testttt")
    if (!PHONE_REGEX.test(phone)) {
      Alert.alert("Invalid Phone Number", "Phone number must follow XXX-XXX-XXXX format");
      return;
    }

    //Validate email
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert("Invalid Email", "Email is not a valid email");
      return;
    }


    const updateData = {
      name,
      phone,
      email,
      prevName: auth?.user
    }

    try {
      await axiosPrivate.patch(UPDATE_URL, {
        updateData
      });
      Alert.alert('Success', 'User Profile Updated');
      setAuth({ ...auth, user: name })
      setRefresh(refresh + 1);
      setIsEdit(false);
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

              {!isEdit ? <TouchableOpacity className='flex-row items-center gap-2' onPress={() => setIsEdit(true)}>
                <FontAwesome name="edit" size={24} color="white" />
                <Text className='text-white text-lg mr-2'>Edit</Text>
              </TouchableOpacity> : null}
            </View>

            <ProfileImagePicker
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />

          </View>

          {/*Profile Tab Content*/}
          <View className='flex flex-col items-center mt-10 w-full gap-4 mb-10'>

            {/*Username field*/}
            <View className='space-y-2 w-full md:w-1/2'>
              <Text className='text-lg text-gray-100 font-pmedium mb-0.5'>Username</Text>
              <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex flex-row items-center mt-1'>
                <TextInput
                  value={name}
                  className={`flex-1 ${!isEdit ? 'text-gray-500' : 'text-white'}`}
                  onChangeText={(val) => setName(val)}
                  editable={isEdit}
                />
              </View>
            </View>

            <View className='space-y-2 w-full md:w-1/2'>
              <Text className='text-lg text-gray-100 font-pmedium mb-0.5'>Email</Text>
              <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex flex-row items-center mt-1'>
                <TextInput
                  value={email}
                  className={`flex-1 ${!isEdit ? 'text-gray-500' : 'text-white'}`}
                  onChangeText={(val) => setEmail(val)}
                  editable={isEdit}
                />
              </View>
            </View>


            <View className='space-y-2 w-full md:w-1/2'>
              <Text className='text-lg text-gray-100 font-pmedium mb-0.5'>Phone</Text>
              <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl flex flex-row items-center mt-1'>
                <TextInput
                  value={phone}
                  className={`flex-1 ${!isEdit ? 'text-gray-500' : 'text-white'}`}
                  onChangeText={(val) => setPhone(val)}
                  editable={isEdit}
                />
              </View>
            </View>

          </View>


          {isEdit ?
            <View className='flex flex-col justify-center items-center w-full gap-4'>
              <CustomButton
                title={'Update'}
                containerStyles={'mt-auto bg-secondary '}
                handlePress={handleUpdate}
              />

              <CustomButton
                title={'Cancel'}
                containerStyles={'mt-auto bg-[#1E1E2D] border border-2 border-gray-100'}
                handlePress={handleCancel}
              />
            </View> :
            <CustomButton
              title={'Sign Out'}
              containerStyles={'mt-auto bg-secondary'}
              handlePress={handleLogout}
            />
          }

        </View>
      </ScrollView>
      <StatusBar className='bg-white' />
    </SafeAreaView>
  )
}

export default Profile


const ProfileImagePicker = ({ profileImage, setProfileImage }) => {

  const pickImage = async () => {

    //Asks user for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //Store users name is a variable so when we are changing it, the username doesnt update on our screen as well

    //If user denies access prompt alert
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile image.');
      return;
    }

    //Open media library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //Sets image assuming process was not canceled
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  return (
    <View className="items-center mt-5 w-">
      <TouchableOpacity onPress={pickImage} className="relative">
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="w-28 h-28 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center">
            <FontAwesome name="user" size={40} color="#CDCDE0" />
          </View>
        )}

        {/* Edit icon overlay */}
        <View className="absolute bottom-0 right-0 bg-secondary p-2 rounded-full">
          <FontAwesome name="camera" size={14} color="white" />
        </View>
      </TouchableOpacity>

      <Text className="text-gray-100 text-lg mt-2 font-pmedium">Tap to change profile picture</Text>
    </View>
  );



}