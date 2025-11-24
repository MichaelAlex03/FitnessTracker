import { View, Text, ScrollView, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'
import { AxiosError } from 'axios'

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'


import { AntDesign } from '@expo/vector-icons';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
const PHONE_NUM_REGEX = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
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

  const [phoneNum, setPhoneNum] = useState('');
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [validPhone, setValidPhone] = useState(false);


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

  //Validate email
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

  //Validate phone number
  useEffect(() => {
    setValidPhone(PHONE_NUM_REGEX.test(phoneNum));
  }, [phoneNum]);

  //Resets error message when user changes input fields
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);



  async function handleSubmit() {

    //Check for user fields and it validity
    if (!user) {
      setErrMsg("Please fill in username field");
      return;
    } else if (!validName) {
      setErrMsg("Invalid Username");
      return;
    }

    //Check for email field and its validity
    if (!email) {
      setErrMsg("Please fill in email field");
      return;
    } else if (!validEmail) {
      setErrMsg("Invalid Email");
      return;
    }

    //Check for password field and its validity
    if (!pwd) {
      setErrMsg("Please fill in password field");
      return;
    } else if (!validPwd) {
      setErrMsg("Invalid Password");
      return;
    }

    //Check if confirm password patches password
    if (!validMatch) {
      setErrMsg("Passwords do not match");
    }


    try {
      const response = await axios.post(REGISTER_URL,
        {
          user,
          pwd,
          email,
          phone: phoneNum
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
        setEmail('');
        setPhoneNum('');
        setMatchPwd('');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (!axiosError?.response) {
        setErrMsg('No Server Response');
      } else if (axiosError.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (axiosError.response?.status === 400) {
        setErrMsg('Username and Password are required');
      } else {
        setErrMsg('Registration Failed');
      }
    }


  }


  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full items-center justify-center min-h-[85vh] px-6 my-6'>

          {/* Modern Header */}
          <View className='items-center mt-10 mb-6'>
            <View className='bg-accent/10 rounded-full p-4 mb-6'>
              <View className='bg-accent rounded-full p-3'>
                <Text className='text-4xl'>🚀</Text>
              </View>
            </View>
            <Text className='text-4xl text-white font-pextrabold tracking-tight'>Get Started</Text>
            <Text className='text-gray-400 mt-3 text-base font-pmedium'>Create your account to begin</Text>
          </View>

          {/* Error Message with Modern Styling */}
          {errMsg && (
            <View className='bg-error/10 border border-error/30 rounded-2xl p-4 mb-4 w-full'>
              <Text className='text-error font-pmedium text-center'>{errMsg}</Text>
            </View>
          )}

          <FormField
            title='Username'
            value={user}
            handleChangeText={(e) => setUser(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setUserFocus(true)}
            handleBlur={() => setUserFocus(false)}
          />
          {userFocus && user && !validName &&
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-warning/10 border border-warning/30 p-3 rounded-xl'>
              <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
              <Text className='text-warning text-sm font-pmedium flex-1'>
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
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-warning/10 border border-warning/30 p-3 rounded-xl'>
              <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
              <Text className='text-warning text-sm font-pmedium flex-1'>
                Your email address should follow the format: username@domain.com.
              </Text>
            </View>
          }

          <FormField
            title='Phone Number'
            value={phoneNum}
            handleChangeText={(e) => setPhoneNum(e)}
            otherStyles={'mt-7'}
            handleFocus={() => setPhoneFocus(true)}
            handleBlur={() => setPhoneFocus(false)}
          />
          {phoneFocus && phoneNum && !validPhone &&
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-warning/10 border border-warning/30 p-3 rounded-xl'>
              <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
              <Text className='text-warning text-sm font-pmedium flex-1'>
                Phone number must be in format XXX-XXX-XXXX
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
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-warning/10 border border-warning/30 p-3 rounded-xl'>
              <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
              <View className='flex-1'>
                <Text className='text-warning text-sm font-pmedium'>
                  8 to 24 characters.
                </Text>
                <Text className='text-warning text-sm font-pmedium'>
                  Must include uppercase and lowercase letters
                </Text>
                <Text className='text-warning text-sm font-pmedium'>
                  a number and a special character.
                </Text>
                <Text className='text-warning text-sm font-pmedium'>
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
            <View className='flex-row items-start justify-start gap-2 mt-2 w-full md:w-1/2 bg-warning/10 border border-warning/30 p-3 rounded-xl'>
              <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
              <Text className='text-warning text-sm font-pmedium flex-1'>
                Does not match the password
              </Text>
            </View>
          }

          <CustomButton
            title="Create Account"
            handlePress={() => router.push('/(auth)/ConfirmRegister')}
            containerStyles={'mt-8 mb-2'}
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-6 flex-row gap-2'>
            <Text className='text-base text-gray-400 font-pregular'>Have an account already?</Text>
            <Link href={'/Login'} className='text-base font-psemibold text-accent'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Register