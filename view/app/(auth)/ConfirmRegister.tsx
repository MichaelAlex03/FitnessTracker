import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'
import { useLocalSearchParams } from 'expo-router';

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'


const ConfirmRegister = () => {

    const [verificationCode, setVerificationCode] = useState<string>("");

    const { email } = useLocalSearchParams();

    const formatVerificationCode = (value: string) => {

        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.slice(0, 10);


        if (limited.length <= 3) {
            return limited
        } else if (limited.length <= 6) {
            return `${limited.slice(0, 3)}-${limited.slice(3)}`
        } else {
            return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
        }
    }

    const handleVerifyCode = async () => {

        let code = verificationCode.replace(/\D/g, '');

        if (code === '') {
            Alert.alert("Empty field", "Please enter in the code you recieved from your email");
            return;
        }

        try {
            const response = await axios.post("/auth/register/verify", {
                verificationCode: code,
                email
            });

            console.log(response)

            if (response.status === 200) {
                Alert.alert("Registration Successful", "Your user was created now just login with your email and password")
                router.push('/(auth)/Login')
            } else if (response.status === 204) {
                Alert.alert("Verification Code Incorrect", "The code you entered was incorrect")
            }


        } catch (error) {
            console.error(error)
        }
    }

    const handleResendEmail = async () => {
        try {
            await axios.post("/auth/register/resend", {
                verificationCode,
                email
            });
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SafeAreaView className='bg-primary h-full' edges={['top', 'left', 'right']}>
            <ScrollView>
                <View className='w-full items-center justify-start min-h-[85vh] px-6 my-6'>

                    <View className='items-center mt-10 mb-8'>
                        <View className='bg-secondary-200/10 rounded-full p-4 mb-6'>
                            <View className='bg-secondary-200 rounded-full p-3'>
                                <Text className='text-4xl'>📧</Text>
                            </View>
                        </View>
                        <Text className='text-4xl text-white text-center font-pextrabold tracking-tight mb-3'>Verify Your Email</Text>
                        <Text className='text-gray-100 text-center font-pregular text-base px-4'>
                            We've sent a verification code to your email. Please enter it below to complete registration.
                        </Text>
                    </View>

                    <View className='w-full'>
                        <FormField
                            title='Verification Code'
                            value={verificationCode}
                            handleChangeText={(e) => setVerificationCode(formatVerificationCode(e))}
                            otherStyles='mt-7'
                        />
                    </View>

                    <CustomButton
                        title='Verify Account'
                        handlePress={handleVerifyCode}
                        containerStyles='w-full mt-8 bg-secondary-200'
                        textStyles='text-primary font-psemibold'
                    />

                    <View className='mt-6 flex-row items-center'>
                        <Text className='text-gray-100 font-pregular text-sm'>
                            Didn't receive the code?{' '}
                        </Text>
                        <TouchableOpacity onPress={handleResendEmail}>
                            <Text className='text-secondary-200 font-psemibold text-sm underline'>
                                Resend Email
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className='mt-8'>
                        <Link href="/Login" asChild>
                            <TouchableOpacity>
                                <Text className='text-gray-100 font-pregular text-sm text-center'>
                                    Back to{' '}
                                    <Text className='text-secondary-200 font-psemibold'>Login</Text>
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ConfirmRegister