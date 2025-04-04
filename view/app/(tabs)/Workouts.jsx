import { Text, ScrollView, View, FlatList, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchUserInfo from '@/hooks/fetchUserInfo'
import fetchWorkouts from '@/hooks/fetchWorkouts'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'


export default function Workouts() {
  const [refresh, setRefresh] = useState(0);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showWorkout, setShowWorkout] = useState(false);

  const { auth } = useAuth();

  // const { workouts } = fetchWorkouts(auth.userId);
  const workoutItem = () => {

  }


  return (
    <SafeAreaView className="bg-primary flex-1">

      <FlatList
        ListHeaderComponent={() => (
          <View className='flex-1 p-5'>

            <View className='mb-10'>
              <Text className='font-bold text-md text-gray-100'>Welcome Back</Text>
              <Text className='text-white font-semibold text-3xl'>{auth?.user}</Text>
            </View>

            <Text className='text-white font-semibold text-4xl'>Start Workout</Text>

            <TouchableOpacity
              className='w-full bg-secondary my-4 rounded-2xl p-4 border border-black-200 active:opacity-100'
              onPress={() => setShowCreateWorkout(true)}
            >
              <Text className='text-white text-center font-pextrabold text-lg'>Create a new workout</Text>
            </TouchableOpacity>

            <View>
              <Text className='text-white font-psemibold text-xl mt-4'>My Workouts</Text>
            </View>
          </View>
        )}
      />
      {
        showCreateWorkout && <CreateWorkout showCreateWorkout={showCreateWorkout} setShowCreateWorkout={setShowCreateWorkout} />
      }
      {
        showWorkout && <WorkoutScreen showWorkout={showWorkout} setShowWorkout={setShowWorkout}/>
      }

    </SafeAreaView>
  )
}

const CreateWorkout = ({ showCreateWorkout, setShowCreateWorkout }) => {

  return (
    <Modal
      visible={showCreateWorkout}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreateWorkout(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Text>Test</Text>
        <TouchableOpacity onPress={() => setShowCreateWorkout(false)}>
          <Text className='text-white'>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const WorkoutScreen = ({showWorkout, setShowWorkout}) => {
  return (
    <Modal
      visible={showWorkout}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowWorkout(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Text>Test</Text>
        <TouchableOpacity onPress={() => setShowWorkout(false)}>
          <Text className='text-white'>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}



