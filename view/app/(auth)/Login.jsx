import { View, Text, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'


const Login = () => {

  const [user, setUser] = useState('');
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)

  let accessToken = '';
  let userId = '';

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(LOGIN_URL,
  //       {
  //         user: user,
  //         pwd: pwd,
  //       },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: true
  //       }
  //     );

  //     userId = response.data.foundUser[0].id;
  //     accessToken = response.data.accessToken;
  //     const userInfo = {
  //       id: userId,
  //       accessToken: accessToken,
  //     }

  //     if (response.status === 200) {
  //       console.log('goes in');
  //       navigate("/workout", { state: userInfo });
  //     }
  //     setUser('');
  //     setPwd('');
  //     setMatchPwd('');
  //   } catch (err) {
  //     if (!err?.response) {
  //       setErrMsg('No Server Response');
  //     } else if (err.response?.status === 409) {
  //       setErrMsg('Username Taken');
  //     } else {
  //       console.log(err.response.data.message)
  //       setErrMsg('Registration Failed');
  //     }
  //   }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Text className='text-[30px] text-white font-bold mt-10 font-psemibold'>Welcome to FitTrackr 👋</Text>
          <Text className='text-gray-100 mt-2'>Please login with your details here</Text>

          <FormField
            title='Username'
            value={user}
            handleChangeText={(e) => setUser(e)}
            otherStyles={'mt-7'}
          />

          <FormField
            title='Password'
            value={pwd}
            handleChangeText={(e) => setPwd(e)}
            otherStyles={'mt-7'}
          />

          <CustomButton
            title="Sign In"
            handlePress={() => {}}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Login