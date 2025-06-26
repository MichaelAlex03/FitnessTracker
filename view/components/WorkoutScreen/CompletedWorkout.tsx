import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

interface Exercise {
  id: number,
  exercise_name: string,
  workout_id: string
}

interface Sets {
  id: string,
  exercise_id: number,
  exercise_reps: number,
  workout_id: number,
  exercise_weight: number,
  set_type: string
}

interface CompletedWorkoutProps {
  exercises: Exercise[]
  sets: Sets[]
  workoutName: string
  workoutTimer: number
  showWorkout: boolean
  setShowWorkout: (val: boolean) => void
}

const CompletedWorkout = ({ exercises, sets, workoutName, workoutTimer, showWorkout, setShowWorkout }: CompletedWorkoutProps) => {
  const totalWeight = sets.reduce((sum, set) => sum + set.exercise_weight, 0);

  const formatTime = () => {
    const minutes = Math.floor(workoutTimer / 60);
    const remainingSeconds = workoutTimer % 60;
    return minutes > 0 ? `${minutes}m` : `${remainingSeconds}s`
  }

  return (
    <Modal
      visible={showWorkout}
      transparent={false}
      animationType='slide'
      onRequestClose={() => setShowWorkout(false)}
    >
      <View className='flex-1 justify-center items-center bg-primary'>

        <View>
          <Text className='text-white text-2xl font-bold'>Congratulations !!!</Text>
        </View>
        <View
          className='w-11/12 p-6 rounded-2xl bg-white'
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className='flex-row justify-between items-center'>
            <Text className='text-primary font-bold text-lg'>{workoutName}</Text>
          </View>

          <View className='flex flex-row justify-between items-center mt-5'>
            <View className='flex flex-row items-center'>
              <AntDesign name="clockcircleo" size={20} color="#1E293B" className='mr-2' />
              <Text className='text-primary'>{formatTime()}</Text>
            </View>
            <View className='flex flex-row items-center'>
              <MaterialCommunityIcons name="dumbbell" size={20} color="#1E293B" className='mr-2' />
              <Text className='text-primary'>{totalWeight}lb</Text>
            </View>
            <View className='flex flex-row items-center'>
              <AntDesign name="Trophy" size={20} color="#1E293B" className='mr-2' />
              <Text className='text-primary'>0 PRs</Text>
            </View>
          </View>

          <View className='flex mt-5'>
            {exercises.map((exercise) => {
              const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);
              return (
                <View className='mb-2' key={exercise.id}>
                  <View className='flex flex-row'>
                    <View className='flex-1'>
                      <View className='flex flex-row justify-between'>
                        <Text className='text-primary font-bold text-xl'>{exercise.exercise_name}</Text>
                        <Text className='text-primary font-bold text-xl'>1RM</Text>
                      </View>
                      {exerciseSets.map((set) => (
                        <View className='flex flex-row justify-between' key={set.id}>
                          <Text className='text-primary text-lg font-base mt-1'>
                            {set.exercise_weight} lb x {set.exercise_reps} reps
                          </Text>
                          <Text className='text-primary text-lg font-base mt-1'>
                            90
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}

            <View className='items-center w-full'>
              <TouchableOpacity className='w-3/4 rounded-2xl bg-secondary p-3 mt-5' onPress={() => setShowWorkout(false)}>
                <Text className='text-white text-center font-bold text-lg'>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CompletedWorkout