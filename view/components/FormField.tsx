import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

interface FormProps {
    title: string,
    value: string,
    placeholder?: string,
    handleChangeText: (text: string) => void,
    otherStyles?: string,
    handleFocus?: () => void,
    handleBlur?: () => void,
    isEdit?: boolean;
}

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, handleFocus, handleBlur, ...props }: FormProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return (
        <View className={`space-y-2 ${otherStyles} w-full md:w-1/2`}>
            <Text className='text-sm text-gray-300 font-pmedium mb-1'>{title}</Text>
            <View className={`border-2 w-full h-14 px-4 bg-surface rounded-2xl flex-row items-center ${isFocused ? 'border-accent' : 'border-gray-700'
                }`}>
                <TextInput
                    className='flex-1 text-white font-pmedium text-base'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor='#6B7280'
                    onChangeText={handleChangeText}
                    secureTextEntry={(title === 'Password' || title === 'Confirm Password' || title === 'Change Password' || title === 'New Password' || title === 'Confirm New Password') && showPassword == false}
                    onFocus={() => {
                        setIsFocused(true)
                        handleFocus?.()
                    }}
                    onBlur={() => {
                        setIsFocused(false)
                        handleBlur?.()
                    }}
                    editable={!props.isEdit}
                />

                <View className='w-10 items-end'>
                    {(title === 'Password' || title === 'Confirm Password' || title === 'Change Password' || title === 'New Password' || title === 'Confirm New Password') && (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="p-2"
                        >
                            <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-5 h-5" resizeMode="contain" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    )
}

export default FormField