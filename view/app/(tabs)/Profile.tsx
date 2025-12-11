import { View, Text, ScrollView, Alert, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import axios from '@/api/axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

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
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await axios.post(LOGOUT_URL, {
        refreshToken 
      });
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
      setPendingImage(null); 
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
    <SafeAreaView className="bg-primary flex-1" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View className='flex-1 p-8'>

          {/*Modern Profile Header*/}
          <View className='w-full mb-8'>
            <View className='flex-row justify-between items-center mb-6'>
              <Text className='text-white text-4xl font-pextrabold tracking-tight'>Profile</Text>

              {!isEdit ? (
                <TouchableOpacity
                  className='flex-row items-center gap-2 bg-accent/20 px-4 py-2 rounded-xl active:bg-accent/30'
                  onPress={() => setIsEdit(true)}
                >
                  <FontAwesome name="edit" size={18} color="#6366F1" />
                  <Text className='text-accent text-base font-pbold'>Edit</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <ProfileImagePicker
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              isEdit={isEdit}
              setPendingImage={setPendingImage}
            />
          </View>

          {/*Profile Tab Content*/}
          <View className='flex flex-col items-center w-full gap-5 mb-10'>

            {/*Username field*/}
            <View className='space-y-2 w-full'>
              <Text className='text-sm text-gray-400 font-pmedium mb-1'>Username</Text>
              <View className={`border-2 w-full h-14 px-4 rounded-2xl flex flex-row items-center ${
                isEdit ? 'bg-surface border-accent/30' : 'bg-surface-elevated border-gray-700'
              }`}>
                <FontAwesome name="user" size={18} color="#6B7280" />
                <TextInput
                  value={name}
                  className={`flex-1 ml-3 font-pmedium text-base ${!isEdit ? 'text-gray-400' : 'text-white'}`}
                  onChangeText={(val) => setName(val)}
                  editable={isEdit}
                />
              </View>
            </View>

            <View className='space-y-2 w-full'>
              <Text className='text-sm text-gray-400 font-pmedium mb-1'>Email</Text>
              <View className={`border-2 w-full h-14 px-4 rounded-2xl flex flex-row items-center ${
                isEdit ? 'bg-surface border-accent/30' : 'bg-surface-elevated border-gray-700'
              }`}>
                <FontAwesome name="envelope" size={16} color="#6B7280" />
                <TextInput
                  value={email}
                  className={`flex-1 ml-3 font-pmedium text-base ${!isEdit ? 'text-gray-400' : 'text-white'}`}
                  onChangeText={(val) => setEmail(val)}
                  editable={isEdit}
                />
              </View>
            </View>


            <View className='space-y-2 w-full'>
              <Text className='text-sm text-gray-400 font-pmedium mb-1'>Phone</Text>
              <View className={`border-2 w-full h-14 px-4 rounded-2xl flex flex-row items-center ${
                isEdit ? 'bg-surface border-accent/30' : 'bg-surface-elevated border-gray-700'
              }`}>
                <FontAwesome name="phone" size={18} color="#6B7280" />
                <TextInput
                  value={phone}
                  className={`flex-1 ml-3 font-pmedium text-base ${!isEdit ? 'text-gray-400' : 'text-white'}`}
                  onChangeText={(val) => setPhone(val)}
                  editable={isEdit}
                />
              </View>
            </View>

          </View>


          {isEdit ?
            <View className='flex flex-col justify-center items-center w-full gap-4 mt-4'>
              <CustomButton
                title={'Update Profile'}
                containerStyles={''}
                handlePress={handleUpdate}
                variant='primary'
              />

              <CustomButton
                title={'Cancel'}
                containerStyles={''}
                handlePress={handleCancel}
                variant='outline'
              />
            </View> :
            <CustomButton
              title={'Sign Out'}
              containerStyles={'mt-4'}
              handlePress={handleLogout}
              variant='danger'
            />
          }

        </View>
      </ScrollView>
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
    <View className="items-center my-6">
      <TouchableOpacity onPress={pickImage} className="relative">
        {profileImage ? (
          <View className="rounded-full border-4 border-accent/30 p-1">
            <Image
              source={{ uri: profileImage }}
              className="w-32 h-32 rounded-full"
            />
          </View>
        ) : (
          <View className="w-32 h-32 rounded-full bg-surface-elevated border-4 border-accent/30 items-center justify-center">
            <FontAwesome name="user" size={50} color="#6B7280" />
          </View>
        )}

        {/* Edit icon overlay with modern styling */}
        <View className="absolute bottom-1 right-1 bg-accent p-3 rounded-full shadow-lg border-2 border-primary">
          <FontAwesome name="camera" size={16} color="white" />
        </View>
      </TouchableOpacity>

    </View>
  );



}