import { View, Text, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'


import { AntDesign } from '@expo/vector-icons';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
const REGISTER_URL = '/auth/register';

const Register = () => {

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  

  const [isSubmitting, setIsSubmitting] = useState(false)

  //Validates Name
  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  //Validates password and confirm password
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  async function handleSubmit(e) {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(REGISTER_URL,
        {
          user,
          pwd,
          email
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        router.push('/Login');
        setUser('');
        setPwd('');
        setMatchPwd('');
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (err.response?.status === 400) {
        setErrMsg('Username and Password are required');
      } else {
        setErrMsg('Registration Failed');
      }
    }


  }


  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full items-center justify-center min-h-[85vh] px-4 my-6'>
          <Text className='text-[27px] sm:text-[30px] text-white font-bold mt-10 font-psemibold'>Create New Account 👋</Text>
          <Text className='text-[12px] sm:-text:sm text-gray-100 mt-2'>Please enter details to create a new account</Text>
          {errMsg && <Text className='font-semibold p-2 mt-2 text-red-700'>{errMsg}</Text>}
          <FormField
            title='Username'
            value={user}
            handleChangeText={(e) => setUser(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setUserFocus(true)}
            handleBlur={() => setUserFocus(false)}
          />
          {userFocus && user && !validName &&
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-black p-2 rounded-lg'>
              <AntDesign name="exclamationcircle" size={12} color="white" className='mt-[2px]' />
              <Text className='text-white rounded-md'>
                4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
              </Text>
            </View>
          }

          <FormField
            title='Email'
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setEmailFocus(true)}
            handleBlur={() => setEmailFocus(false)} 
          />
          {emailFocus && email && !validEmail &&
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-black p-2 rounded-lg'>
              <AntDesign name="exclamationcircle" size={12} color="white" className='mt-[2px]' />
              <Text className='text-white rounded-md'>
              Your email address should follow the format: username@domain.com.
              </Text>
            </View>
          }

          <FormField
            title='Password'
            value={pwd}
            handleChangeText={(e) => setPwd(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setPwdFocus(true)}
            handleBlur={() => setPwdFocus(false)}
          />
          {pwdFocus && !validPwd &&
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-black p-2 rounded-lg'>
              <AntDesign name="exclamationcircle" size={12} color="white" className='mt-[2px]' />
              <View className='w-5/6 md:w-4/5 flex-col'>
                <Text className='text-white rounded-md'>
                  8 to 24 characters.
                </Text>
                <Text className='text-white rounded-md'>
                  Must include uppercase and lowercase letters
                </Text>
                <Text className='text-white rounded-md'>
                  a number and a special character.
                </Text>
                <Text className='text-white rounded-md'>
                  Allowed special characters: ! @ # %
                </Text>
              </View>
            </View>
          }

          <FormField
            title='Confirm Password'
            value={matchPwd}
            handleChangeText={(e) => setMatchPwd(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setMatchFocus(true)}
            handleBlur={() => setMatchFocus(false)}
          />
          {matchPwd && !validMatch && matchFocus &&
            <View className='flex-row items-center justify-start gap-2 mt-2 w-full md:w-1/2 bg-black p-2 rounded-lg'>
              <AntDesign name="exclamationcircle" size={12} color="white" />
              <Text className=' p-2 rounded-md text-white'>
                Does not match the password
              </Text>
            </View>
          }

          <CustomButton
            title="Create Account"
            handlePress={handleSubmit}
            containerStyles={validName && validPwd && validMatch
              ? 'mt-7 mb-2'
              : 'opacity-40 mt-7 mb-2'}
            isLoading={isSubmitting}
            disabled={!validName || !validPwd || !validMatch || !email ? true : false}
          />


          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>Have an account already?</Text>
            <Link href={'/Login'} className='text-lg font-psemibold text-secondary'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Register