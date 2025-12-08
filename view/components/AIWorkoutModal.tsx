import { View, Text, Modal, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

interface Exercise {
  exercise_name: string
  exercise_category: string
  exercise_bodypart: string
}

interface WorkoutData {
  workout_name: string
  exercises: Exercise[]
  reasoning: string
}

interface AIWorkoutModalProps {
  visible: boolean
  workoutData: WorkoutData | null | undefined
  onClose: () => void
}

const AIWorkoutModal: React.FC<AIWorkoutModalProps> = ({ visible, workoutData, onClose }) => {
  if (!workoutData) return null

  const renderExercise = ({ item, index }: { item: Exercise; index: number }) => {
    return (
      <View className='mx-4 mb-3 bg-surface rounded-2xl border-2 border-gray-700 p-4'>
        <View className='flex-row items-center'>
          <View className='bg-accent/20 w-10 h-10 rounded-lg items-center justify-center mr-3'>
            <Text className='text-accent font-pbold text-base'>{index + 1}</Text>
          </View>
          <View className='flex-1'>
            <Text className='text-white font-pbold text-base mb-2'>
              {item.exercise_name}
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              <View className='bg-blue-500/20 px-3 py-1 rounded-full'>
                <Text className='text-blue-400 font-pmedium text-xs'>
                  {item.exercise_category}
                </Text>
              </View>
              <View className='bg-green-500/20 px-3 py-1 rounded-full'>
                <Text className='text-green-400 font-pmedium text-xs'>
                  {item.exercise_bodypart}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      statusBarTranslucent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className='flex-1 bg-primary'>
        <StatusBar barStyle='light-content' backgroundColor='#0A0E1A' />

        {/* Header */}
        <View className='px-6 pt-4 pb-4 border-b-2 border-surface flex-row items-center justify-between'>
          <View className='flex-1 flex-row items-center'>
            <View className='bg-accent/20 rounded-full p-2 mr-3'>
              <MaterialCommunityIcons name='robot-excited-outline' size={24} color='#6366F1' />
            </View>
            <View className='flex-1'>
              <Text className='text-white font-pextrabold text-xl' numberOfLines={2}>
                {workoutData.workout_name}
              </Text>
              <View className='bg-accent/20 px-2 py-0.5 rounded-md self-start mt-1'>
                <Text className='text-accent font-pmedium text-xs'>AI Generated</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            className='bg-surface-elevated p-3 rounded-xl ml-2'
            onPress={onClose}
          >
            <Ionicons name='close' size={24} color='#6366F1' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={workoutData.exercises}
          renderItem={renderExercise}
          keyExtractor={(item, index) => `${item.exercise_name}-${index}`}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={
            <View>
              {/* Reasoning Section */}
              <View className='mx-4 mt-4 mb-3 bg-surface rounded-2xl border-2 border-accent/30 p-4'>
                <View className='flex-row items-center mb-2'>
                  <MaterialCommunityIcons name='lightbulb-on' size={20} color='#6366F1' />
                  <Text className='text-white font-pbold text-base ml-2'>Why this workout?</Text>
                </View>
                <Text className='text-gray-300 font-pmedium text-sm leading-5'>
                  {workoutData.reasoning}
                </Text>
              </View>

              {/* Exercise Count Banner */}
              <View className='mx-4 mb-4 bg-accent/10 border border-accent/30 rounded-xl p-3 flex-row items-center'>
                <View className='bg-accent/20 rounded-full p-2 mr-3'>
                  <MaterialCommunityIcons name='dumbbell' size={20} color='#6366F1' />
                </View>
                <Text className='text-white font-pbold text-base'>
                  {workoutData.exercises.length} {workoutData.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className='flex-1 justify-center items-center py-20'>
              <Text className='text-gray-400 font-pmedium text-base'>No exercises found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  )
}

export default AIWorkoutModal
