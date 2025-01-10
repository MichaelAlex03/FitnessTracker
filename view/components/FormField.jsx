import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { API_URL } from '@env'

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, handleFocus, handleBlur, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    console.log(API_URL)

    return (
        <View className={`space-y-2 ${otherStyles} w-full md:w-1/2`}>
            <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>
            <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary flex-row items-center'>
                <TextInput
                    className='flex-1 text-white font-psemibold text-base'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor='#7b7b8b'
                    onChangeText={handleChangeText}
                    secureTextEntry={(title === 'Password' || title === 'Confirm Password') && showPassword == false}
                    onFocus={handleFocus}
                    onBlur={handleBlur}

                />

                <View className='w-24 items-end'>
                    {(title === 'Password' || title === 'Confirm Password') && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

export default FormField