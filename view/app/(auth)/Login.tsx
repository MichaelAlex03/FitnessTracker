import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'
import { AxiosError } from 'axios'


import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import useAuth from '@/hooks/useAuth';

const LOGIN_URL = '/auth/login';


const Login = () => {

  const { setIsLoggedIn, setAuth } = useAuth();

  const [email, setEmail] = useState('');

  const [pwd, setPwd] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)


  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);


  async function handleSubmit() {
    try {
      const response = await axios.post(LOGIN_URL,
        {
          email: email,
          pwd: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      setAuth({ email, pwd, accessToken: response.data.accessToken, userId: response.data.id, user: response.data.user })
      setIsLoggedIn(true)

      if (response.status === 200) {
        router.replace('/Workouts');
      }
      setEmail('');
      setPwd('');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (!axiosError?.response) {
        setErrMsg('No Server Response');
      } else if (axiosError.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (axiosError.response?.status === 400) {
        setErrMsg('Username and Password required');
      } else {
        setErrMsg('Username or Password is incorrect');
      }
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full items-center justify-center min-h-[85vh] px-4 my-6'>
          <Text className='text-[30px] text-white font-bold mt-10 font-psemibold'>Welcome to FitTrackr 👋</Text>
          <Text className='text-gray-100 mt-2'>Please login with your details here</Text>

          {errMsg && <Text className='font-semibold p-2 mt-2 text-red-700'>{errMsg}</Text>}
          <FormField
            title='Email'
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles={'mt-7'}
          />

          <FormField
            title='Password'
            value={pwd}
            handleChangeText={(e) => setPwd(e)}
            otherStyles={'mt-7'}
          />

          <TouchableOpacity className='w-full flex flex-row justify-end'>
            <Text className='text-gray-100 text-base mt-4 font-bold'>
              <Link href={'/'}>Forgot Password?</Link>
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles={'mt-6 bg-secondary'}
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
            <Link href={'/Register'} className='text-lg font-psemibold text-secondary'>
              Sign Up
            </Link>
          </View>


        </View>

      </ScrollView>
    </SafeAreaView>
  )
}


export default Login