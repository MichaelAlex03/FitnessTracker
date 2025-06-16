import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface DropSetModalProps {
  setShowSetTypeInfo: (show: boolean) => void
}

const DropSetModal = ({ setShowSetTypeInfo }: DropSetModalProps) => {
  return (
      <View className='bg-black-100 w-full h-1/3 rounded-2xl items-center justify-center'>
        <View className='w-11/12 h-full items-center justify-center'>
          <Text className='text-white text-2xl font-bold mb-10'>Drop Set</Text>
          <Text className='text-white text-base font-semibold text-center'>
            A drop set is a set of exercises that are performed after the main set of an exercise.
          </Text>
          <Text className='text-white text-base font-semibold text-center'>
            It is used to drop the weight of the main set.
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

export default DropSetModal