import React from 'react'
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      transparent={true}
      animationType='slide'
      onRequestClose={() => setShowWorkout(false)}
    >
      <SafeAreaView className='flex-1 justify-end bg-black/50' edges={['top', 'left', 'right']}>
        <View className='bg-primary rounded-t-3xl max-h-[90%]'>
          
          <View className='items-center px-6 py-6 border-b border-gray-700'>
            <View className='bg-success/20 rounded-full p-4 mb-4'>
              <MaterialCommunityIcons name="trophy" size={48} color="#10B981" />
            </View>
            <Text className='text-success font-pextrabold text-2xl mb-1'>Workout Complete!</Text>
            <Text className='text-white font-pbold text-xl'>{workoutName}</Text>
            <Text className='text-gray-400 font-pmedium text-sm mt-2'>Great job! You crushed it!</Text>
          </View>

         
          <View className='flex-row gap-3 px-6 py-4'>
            <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
              <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#6366F1" />
              </View>
              <Text className='text-accent font-pbold text-xl'>{formatTime()}</Text>
              <Text className='text-accent/70 font-pmedium text-xs'>Duration</Text>
            </View>

            <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
              <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                <MaterialCommunityIcons name="weight-lifter" size={20} color="#6366F1" />
              </View>
              <Text className='text-accent font-pbold text-xl'>{totalWeight}</Text>
              <Text className='text-accent/70 font-pmedium text-xs'>Total Volume (lbs)</Text>
            </View>

            <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
              <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                <MaterialCommunityIcons name="format-list-numbered" size={20} color="#6366F1" />
              </View>
              <Text className='text-accent font-pbold text-xl'>{exercises.length}</Text>
              <Text className='text-accent/70 font-pmedium text-xs'>Exercises</Text>
            </View>
          </View>

         
          <ScrollView className='px-6 pb-4' showsVerticalScrollIndicator={false}>
            <Text className='text-white font-pbold text-lg mb-3'>Exercise Summary</Text>

            {exercises.map((exercise) => {
              const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);
              const exerciseVolume = exerciseSets.reduce((sum, set) =>
                sum + (set.exercise_weight * set.exercise_reps), 0
              );

              return (
                <View className='mb-4 bg-surface border-2 border-gray-700 rounded-2xl p-4' key={exercise.id}>
                  <View className='flex-row items-center justify-between mb-3 pb-2 border-b border-gray-700'>
                    <View className='flex-1'>
                      <Text className='text-white font-pbold text-lg'>{exercise.exercise_name}</Text>
                      <Text className='text-gray-400 font-pmedium text-xs mt-1'>
                        {exerciseSets.length} {exerciseSets.length === 1 ? 'set' : 'sets'} • {exerciseVolume} lbs volume
                      </Text>
                    </View>
                  </View>

                  <View className='gap-2'>
                    {exerciseSets.map((set, setIndex) => {
                      const getSetTypeStyle = () => {
                        switch(set.set_type.toLowerCase()) {
                          case 'warmup':
                            return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
                          case 'drop':
                            return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
                          case 'failure':
                            return { bg: 'bg-red-500/20', text: 'text-red-400' };
                          default:
                            return { bg: 'bg-accent/20', text: 'text-accent' };
                        }
                      };

                      const setStyle = getSetTypeStyle();

                      return (
                        <View className='flex-row items-center justify-between bg-primary-light/50 rounded-xl p-3' key={set.id}>
                          <View className='flex-row items-center flex-1'>
                            <View className={`${setStyle.bg} w-8 h-8 rounded-lg items-center justify-center mr-3`}>
                              <Text className={`${setStyle.text} font-pbold text-sm`}>
                                {setIndex + 1}
                              </Text>
                            </View>

                            <View className='flex-row items-center'>
                              <Text className='text-white font-pbold text-base'>
                                {set.exercise_weight}
                              </Text>
                              <Text className='text-gray-400 font-pmedium text-sm mx-1'>
                                lbs ×
                              </Text>
                              <Text className='text-white font-pbold text-base'>
                                {set.exercise_reps}
                              </Text>
                              <Text className='text-gray-400 font-pmedium text-sm ml-1'>
                                reps
                              </Text>
                            </View>
                          </View>

                          {set.set_type.toLowerCase() !== 'default' && (
                            <View className={`${setStyle.bg} px-2 py-1 rounded-md`}>
                              <Text className={`${setStyle.text} font-pmedium text-xs uppercase`}>
                                {set.set_type}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}

           
            <TouchableOpacity
              className='bg-success rounded-2xl p-4 mt-2 mb-6 flex-row items-center justify-center shadow-lg'
              onPress={() => setShowWorkout(false)}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text className='text-white font-pbold text-lg ml-2'>Finish Workout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default CompletedWorkout