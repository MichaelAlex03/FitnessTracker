import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'
import { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store';


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

      setAuth({ 
        email, 
        pwd, 
        accessToken: response.data.accessToken, 
        userId: response.data.id, 
        user: response.data.user,
        isPaid: response.data.isPaid 
      })
      SecureStore.setItemAsync("refreshToken", response.data.refreshToken)
      setIsLoggedIn(true)
      console.log(response.data.refreshToken)

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
    <SafeAreaView className='bg-primary h-full' edges={['top', 'left', 'right']}>
      <ScrollView>
        <View className='w-full items-center justify-center min-h-[85vh] px-6 my-6'>

          {/* Modern Header with Gradient Effect */}
          <View className='items-center mt-10 mb-8'>
            <View className='bg-accent/10 rounded-full p-4 mb-6'>
              <View className='bg-accent rounded-full p-3'>
                <Text className='text-4xl'>💪</Text>
              </View>
            </View>
            <Text className='text-4xl text-white font-pextrabold tracking-tight'>Welcome Back</Text>
            <Text className='text-gray-400 mt-3 text-base font-pmedium'>Continue your fitness journey</Text>
          </View>

          {/* Error Message with Modern Styling */}
          {errMsg && (
            <View className='bg-error/10 border border-error/30 rounded-2xl p-4 mb-4 w-full'>
              <Text className='text-error font-pmedium text-center'>{errMsg}</Text>
            </View>
          )}

          {/* Form Fields */}
          <FormField
            title='Email'
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles={'mt-2'}
          />

          <FormField
            title='Password'
            value={pwd}
            handleChangeText={(e) => setPwd(e)}
            otherStyles={'mt-5'}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity className='w-full flex flex-row justify-end mt-4'>
            <Link href={'/(auth)/ForgotPassword'} className='text-accent font-psemibold text-base'>
              Forgot Password?
            </Link>
          </TouchableOpacity>

          {/* Sign In Button */}
          <CustomButton
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles={'mt-8 bg-gradient-to-r from-accent to-accent-purple'}
            isLoading={isSubmitting}
          />

          {/* Sign Up Link */}
          <View className='justify-center pt-6 flex-row gap-2'>
            <Text className='text-base text-gray-400 font-pregular'>Don't have an account?</Text>
            <Link href={'/Register'} className='text-base font-psemibold text-accent'>
              Sign Up
            </Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Login