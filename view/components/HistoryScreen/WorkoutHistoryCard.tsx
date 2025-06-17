import { Text, View } from 'react-native'
import React from 'react'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { AntDesign } from '@expo/vector-icons'

interface Sets {
  id: string,
  exercise_id: number,
  exercise_reps: number,
  workout_id: number,
  exercise_weight: number,
  set_type: string
}

interface HistoryCard {
  workoutName: string
  sets: Sets[]
}

const WorkoutHistoryCard = () => {

  const handleDeleteWorkout = async () => {

  }


  return (
    <View className='bg-primary border border-white rounded-lg p-4'>

      <View className='flex-row justify-between items-center'>
        <Text className='text-white font-bold text-lg'>Legs</Text>
        <Menu>
          <MenuTrigger>
            <View className="bg-secondary/20 p-2 rounded-xl">
              <AntDesign name="ellipsis1" size={20} color="#FF9C01" />
            </View>
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              backgroundColor: '#1E1E1E',
              borderRadius: 8,
              marginTop: 40,
            }}
          >
            <MenuOption
              onSelect={() => { handleDeleteWorkout() }}
              style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
            >
              <AntDesign name="delete" size={20} color="red" className='mr-2' />
              <Text className="text-white text-base">Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  )
}

export default WorkoutHistoryCard

