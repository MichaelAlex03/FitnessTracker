import {  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface FailureSetModalProps {
  setShowSetTypeInfo: (show: boolean) => void
}

const FailureSetModal = ({ setShowSetTypeInfo }: FailureSetModalProps) => {
  return (
    <View className='bg-black-100 w-full h-1/3 rounded-2xl items-center justify-center'>
      <View className='w-11/12 h-full items-center justify-center'>
        <Text className='text-white text-2xl font-bold mb-10'>Failure Set</Text>
        <Text className='text-white text-base font-semibold text-center'>
          A failure set is a set of that is performed until you can no longer perform the exercise.
        </Text>
        <Text className='text-white text-base font-semibold text-center'>
          Do not perform failure sets all the time as they cause lots of fatigue in the muscles.
        </Text>

        <TouchableOpacity className='bg-secondary/20 p-2 rounded-lg w-full mt-10' onPress={() => {
          setShowSetTypeInfo(false)
        }}>
          <Text className='text-white text-base font-semibold text-center'>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FailureSetModal

