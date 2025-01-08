import { View, Text, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

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

  const [errMsg, setErrMsg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

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
          <Text className='text-[30px] text-white font-bold mt-10 font-psemibold'>Create New Account 👋</Text>
          <Text className='text-sm text-gray-100 mt-2'>Please enter details to create a new account</Text>

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

          <FormField
            title='Confirm Password'
            value={matchPwd}
            handleChangeText={(e) => setMatchPwd(e)}
            otherStyles={'mt-7'}
          />

          <CustomButton
            title="Sign In"
            handlePress={() => { }}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Register