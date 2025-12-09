import { View, Text, Modal, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useAuth from '@/hooks/useAuth'
import { router } from 'expo-router'
import { workoutEvents, WORKOUT_EVENTS } from '@/utils/eventEmiiter';

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

const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';

const AIWorkoutModal: React.FC<AIWorkoutModalProps> = ({ visible, workoutData, onClose }) => {
  if (!workoutData) return null

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth()

  const handleSaveWorkout = async () => {
    if (workoutData.exercises.length === 0) {
      Alert.alert("No Exercises Selected", "Please select at least one exercise to create a workout");
      return;
    }

    if (!workoutData.workout_name.trim()) {
      Alert.alert("No Workout Name", "Please enter a workout name");
      return;
    }

    try {
      const response = await axiosPrivate.post(WORKOUT_URL, {
        userId: auth.userId,
        workoutName: workoutData.workout_name,
      })

      const workoutId = response.data.workoutId;

      const res = await axiosPrivate.post(EXERCISES_URL, {
        workoutId,
        selectedExercises: workoutData.exercises
      })

      if (res.status === 201) {
        Alert.alert("Workout Created", `"${workoutData.workout_name}" has been created successfully!`);
        onClose()
        workoutEvents.emit(WORKOUT_EVENTS.WORKOUT_CREATED)
        router.push('/(tabs)/Workouts')
      }

    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Failed to create workout. Please try again.");
    }
  }

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

              <View className='mx-4 mt-4 mb-3 bg-surface rounded-2xl border-2 border-accent/30 p-4'>
                <View className='flex-row items-center mb-2'>
                  <MaterialCommunityIcons name='lightbulb-on' size={20} color='#6366F1' />
                  <Text className='text-white font-pbold text-base ml-2'>Why this workout?</Text>
                </View>
                <Text className='text-gray-300 font-pmedium text-sm leading-5'>
                  {workoutData.reasoning}
                </Text>
              </View>


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
          ListFooterComponent={
            <View className='mx-4 mt-4'>
              <TouchableOpacity
                className='bg-accent rounded-xl py-3 items-center active:bg-accent/80'
                onPress={handleSaveWorkout}
              >
                <Text className='text-white text-lg'>Save Workout</Text>
              </TouchableOpacity>
            </View>
          }
        />


      </SafeAreaView>
    </Modal>
  )
}

export default AIWorkoutModal
