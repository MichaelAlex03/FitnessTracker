import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface WarmUpSetProps {
  setShowSetTypeInfo: (show: boolean) => void
}

const WarmUpSet = ({ setShowSetTypeInfo }: WarmUpSetProps) => {
  return (
    <View className='bg-black-100 w-full h-1/3 rounded-2xl items-center justify-center'>
      <View className='w-11/12 h-full items-center justify-center'>
        <Text className='text-white text-2xl font-bold mb-10'>Warm Up Set</Text>
        <Text className='text-white text-base font-semibold text-center'>
          A warm-up set is a set of exercises that are performed before the main set of an exercise.
        </Text>
        <Text className='text-white text-base font-semibold text-center'>
          It is used to warm up the muscles and prepare them for the main set.
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

export default WarmUpSet

