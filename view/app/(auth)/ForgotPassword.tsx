import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { Link, router } from "expo-router";
import axios from '@/api/axios'



const ForgotPassword = () => {

    const [email, setEmail] = useState<string>('');
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

    const handleResetPassword = async () => {



        try {
            setIsSendingEmail(true);
            if (!email) {
                Alert.alert("Email Blank", "Please enter in the email for your account");
                return;
            }

            const response = await axios.post('/auth/passwordReset/send-email', {
                email
            });

            if (response.status === 200) {
                router.push({ pathname: '/(auth)/VerifyEmailSent', params: { email } })
            }

        } catch (error) {
            Alert.alert("Failed to send email", "Failed to send email to user. Please try again later")
        } finally {
            setIsSendingEmail(false)
        }
    }


    return (
        <SafeAreaView className='bg-primary flex-1 items-center relative' edges={['top', 'left', 'right']}>
            {
                isSendingEmail && (
                    <View className="absolute inset-0 flex-1 bg-black/60 items-center justify-center z-50">
                        <ActivityIndicator size="large" color="#6366F1" />
                        <Text className="text-white text-xs mt-2 font-pmedium">Sending Email...</Text>
                    </View>
                )
            }
            <View className='p-6 items-center w-full'>

                <View className='items-center'>
                    <View className='bg-secondary-200/10 rounded-full p-4 mb-6'>
                        <View className='bg-secondary-200 rounded-full p-3'>
                            <Text className='text-4xl'>📧</Text>
                        </View>
                    </View>
                    <Text className='text-lg text-white text-center tracking-tight mb-3'> Enter the email to your account that you would like to reset</Text>
                </View>

                <View className='w-full'>
                    <FormField
                        title='Email'
                        value={email}
                        handleChangeText={(e) => setEmail(e)}
                        otherStyles='mt-7'
                    />
                </View>

                <CustomButton
                    title='Reset Password'
                    handlePress={handleResetPassword}
                    containerStyles='w-full mt-8 bg-secondary-200'
                    textStyles='text-primary font-psemibold'
                />

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

        </SafeAreaView>
    )
}

export default ForgotPassword