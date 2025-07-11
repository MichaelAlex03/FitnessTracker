import { View, Text, ScrollView, Alert, StatusBar, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import axios from '@/api/axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import CustomButton from '@/components/CustomButton'
import useAuth from '@/hooks/useAuth';
import fetchUserInfo from '@/hooks/fetchUserInfo';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UPDATE_URL = '/api/user'
const LOGOUT_URL = '/auth/logout'
const S3_URL = '/api/getPresignedUrl'
const PHONE_REGEX = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface ImagePickerProps {
  profileImage: string | null,
  setProfileImage: React.Dispatch<React.SetStateAction<null | string>>,
  isEdit: boolean,
  setPendingImage: React.Dispatch<React.SetStateAction<null | string>>
}


const Profile = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const [refresh, setRefresh] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageKey, setProfileImageKey] = useState<string | null>(null)
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  //Fetch current user info
  const { userInfo } = fetchUserInfo({ refresh, name: auth?.user, accessToken: auth?.accessToken });

  //Use useEffect to set state due to asnyc nature
  useEffect(() => {
    if (userInfo && userInfo.length > 0) {
      setName(userInfo[0].user_name);
      setEmail(userInfo[0].user_email);
      setPhone(userInfo[0].user_phone);
      setProfileImage(userInfo[0].profile_image || null);
      setProfileImageKey(userInfo[0].profile_image_key || null)
      setPendingImage(null);
    }
  }, [userInfo]);

  //Reset State when pressing cancel
  const handleCancel = () => {
    setName(userInfo[0].user_name);
    setEmail(userInfo[0].user_email);
    setPhone(userInfo[0].user_phone);
    setProfileImage(userInfo[0].profile_image || null);
    setProfileImageKey(userInfo[0].profile_image_key || null);
    setPendingImage(null);
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

  //If the user uploads/changes image will use this else will use api call with default value for key/imageUrl(null)
  const handleProfileUpdateWithImageKey = async (key: string, imageUrl: string | null) => {
    const updateData = {
      name,
      phone,
      email,
      prevName: auth?.user,
      imageUrl,
      profileImageKey: key
    }

    try {
      await axiosPrivate.patch(UPDATE_URL, {
        updateData
      });
      Alert.alert('Success', 'User Profile Updated');
      setAuth({ ...auth, user: name })
      setProfileImageKey(key)
      setRefresh(refresh + 1);
      setIsEdit(false);
      setPendingImage(null); // clear pending image after update
    } catch (error) {
      Alert.alert('Failed Update', 'Failed to update user info')
    }
  }

  const handleUpdate = async () => {

    //Check for any changes if not no need to make update call
    if (name === userInfo[0]?.user_name && email === userInfo[0]?.user_email && phone === userInfo[0]?.user_phone && userInfo[0]?.profile_image === profileImage) {
      Alert.alert("No changes made", "No fields were changed. Please make changes to update");
      return;
    }

    //Validate phone number
    if (!PHONE_REGEX.test(phone)) {
      Alert.alert("Invalid Phone Number", "Phone number must follow XXX-XXX-XXXX format");
      return;
    }

    //Validate email
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert("Invalid Email", "Email is not a valid email");
      return;
    }

    let imageUrl = profileImage; // default to current image

    // If there's a new image picked (pendingImage), upload it
    if (pendingImage) {
      try {
        // Get file type
        let fileType = 'image/jpeg';
        if (pendingImage.endsWith('.png')) fileType = 'image/png';
        else if (pendingImage.endsWith('.jpg') || pendingImage.endsWith('.jpeg')) fileType = 'image/jpeg';

        const blob = await fetch(pendingImage).then(res => res.blob());

        if (profileImageKey) {
          await axiosPrivate.delete(S3_URL, {
            data: { key: profileImageKey }
          })
          console.log("delteee")
        }

        const response = await axiosPrivate.get(S3_URL, { params: { fileType } });
        const { uploadUrl, key, publicUrl } = response.data;

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': fileType },
          body: blob,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload to S3');
        imageUrl = publicUrl;

        handleProfileUpdateWithImageKey(key, imageUrl);
        return;
      } catch (error) {
        Alert.alert('Upload Failed', 'Could not upload profile image.');
        return;
      }
    }

    const updateData = {
      name,
      phone,
      email,
      prevName: auth?.user,
      imageUrl,
      profileImageKey

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
              isEdit={isEdit}
              setPendingImage={setPendingImage}
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


const ProfileImagePicker = ({ profileImage, setProfileImage, isEdit, setPendingImage }: ImagePickerProps) => {



  const pickImage = async () => {
    if (!isEdit) {
      Alert.alert('Edit Required', 'Tap "Edit" before changing your profile picture.');
      return;
    }
    //Asks user for permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


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
      const imageAsset = result.assets[0];
      setProfileImage(imageAsset.uri); // show immediately
      setPendingImage(imageAsset.uri); // mark as pending upload
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

    </View>
  );



}