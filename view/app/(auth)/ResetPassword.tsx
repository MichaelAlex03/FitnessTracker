import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from "expo-router";
import axios from '../../api/axios'
import { useLocalSearchParams } from 'expo-router';

import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { AntDesign } from '@expo/vector-icons';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword = () => {

    const { email } = useLocalSearchParams();

    const [newPassword, setNewPassword] = useState<string>("");
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [hasMinLength, setHasMinLength] = useState<boolean>(false);
    const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
    const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);
    const [hasSpecialChar, setHasSpecialChar] = useState<boolean>(false);

    const [matchPassword, setMatchPassword] = useState<string>("");
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);



    useEffect(() => {

        setHasMinLength(newPassword.length >= 8 && newPassword.length <= 24);
        setHasUpperCase(/[A-Z]/.test(newPassword));
        setHasLowerCase(/[a-z]/.test(newPassword));
        setHasNumber(/[0-9]/.test(newPassword));
        setHasSpecialChar(/[!@#$%]/.test(newPassword));

        setValidMatch(matchPassword === newPassword && newPassword.length > 0);
    }, [newPassword, matchPassword]);


    const renderRequirement = (isMet: boolean, text: string) => {
        const isEmpty = newPassword.length === 0;
        const iconName = isEmpty ? 'minuscircleo' : isMet ? 'checkcircle' : 'closecircle';
        const iconColor = isEmpty ? '#9CA3AF' : isMet ? '#10B981' : '#EF4444';
        const textColor = isEmpty ? 'text-gray-100' : isMet ? 'text-green-500' : 'text-red-500';

        return (
            <View className='flex-row items-center gap-2 mb-1'>
                <AntDesign name={iconName} size={14} color={iconColor} />
                <Text className={`${textColor} text-sm font-pregular`}>{text}</Text>
            </View>
        );
    };

    const handleResetPassword = async () => {

        if (!(hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
            Alert.alert("Invalid Password", "The password entered does not meet all the requirements");
            return;
        }

        if (!validMatch) {
            Alert.alert("Passwords Dont Match", "The passwords entered do not match")
            return;
        }

        try {
            const response = await axios.patch('/auth/passwordReset/reset-password', {
                email,
                newPassword
            })

            if (response.status === 200) {
                Alert.alert("Password Reset", "Your password has been reset", [
                    { text: 'OK', onPress: () => router.push('/(auth)/Login') },
                ])
            }
        } catch (error) {

        }
    }


    return (
        <SafeAreaView className='bg-primary flex-1'>

            <View className='w-full items-center justify-start px-6 my-6 '>

                <View className='items-center mt-10 mb-8'>
                    <View className='bg-secondary-200/10 rounded-full p-4 mb-6'>
                        <View className='bg-secondary-200 rounded-full p-3'>
                            <Text className='text-4xl'>📧</Text>
                        </View>
                    </View>
                    <Text className='text-4xl text-white text-center font-pextrabold tracking-tight mb-3'>Verify Your Email</Text>
                    <Text className='text-gray-100 text-center font-pregular text-base px-4'>
                        We've sent a verification code to your email. Please enter it below to verify the email.
                    </Text>
                </View>

                <View className='w-full'>
                    <FormField
                        title='New Password'
                        value={newPassword}
                        handleChangeText={(e) => setNewPassword(e)}
                        otherStyles='mt-7'
                        handleFocus={() => setPwdFocus(true)}
                        handleBlur={() => setPwdFocus(false)}
                    />
                    {pwdFocus &&
                        <View className='mt-2 w-full bg-gray-100/5 border border-gray-100/10 p-4 rounded-xl'>
                            <Text className='text-gray-100 text-sm font-pmedium mb-3'>Password Requirements:</Text>
                            {renderRequirement(hasMinLength, '8 to 24 characters')}
                            {renderRequirement(hasUpperCase, 'At least one uppercase letter (A-Z)')}
                            {renderRequirement(hasLowerCase, 'At least one lowercase letter (a-z)')}
                            {renderRequirement(hasNumber, 'At least one number (0-9)')}
                            {renderRequirement(hasSpecialChar, 'At least one special character (!@#$%)')}
                        </View>
                    }
                    <FormField
                        title='Confirm New Password'
                        value={matchPassword}
                        handleChangeText={(e) => setMatchPassword(e)}
                        otherStyles='mt-7'
                        handleFocus={() => setMatchFocus(true)}
                        handleBlur={() => setMatchFocus(false)}
                    />
                    {matchFocus && matchPassword && !validMatch &&
                        <View className='flex-row items-start justify-start gap-2 mt-2 w-full bg-warning/10 border border-warning/30 p-3 rounded-xl'>
                            <AntDesign name="exclamationcircle" size={14} color="#F59E0B" className='mt-[2px]' />
                            <Text className='text-warning text-sm font-pmedium flex-1'>
                                Passwords do not match
                            </Text>
                        </View>
                    }
                </View>

                <CustomButton
                    title='Change Password'
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

export default ResetPassword