import { Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WorkoutHistoryModal from './WorkoutHistoryModal';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';


interface Set {
  id: string
  exercise_id: number
  exercise_reps: number
  workout_id: number
  exercise_weight: number
  set_type: string
  user_id: string,
  exercise_name: string
}

interface Exercise {
  id: number
  exercise_name: string
  workout_id: number
  user_id: string
}

interface Workout {
  id: number
  created_at: Date
  workout_name: string
  user_id: string,
  time_elapsed: number
}

interface HistoryCardProps {
  sets: Set[]
  exercises: Exercise[]
  workout: Workout
  refresh: number
  setRefresh: (val: number) => void
}

const DELETE_HISTORY_URL = '/api/history/delete'

const WorkoutHistoryCard = ({ workout, exercises, sets, refresh, setRefresh }: HistoryCardProps) => {

  const axiosPrivate = useAxiosPrivate();
  const dateOfWorkout = workout.created_at;
  const totalWeight = sets.reduce((sum, set) => sum + set.exercise_weight, 0);
  const [showWorkoutHistory, setShowWorkoutHistory] = useState(false);

  const handleDeleteWorkout = async (workoutId: Number) => {
    try {
      const deleteResponse = await axiosPrivate.delete(`${DELETE_HISTORY_URL}/${workoutId}`);
      console.log(deleteResponse)
      if (deleteResponse.status === 204) {
        setRefresh(refresh + 1);
      }
    } catch (error) {
      console.error(error)
    }
  }

  const formatTime = () => {
    const minutes = Math.floor(workout.time_elapsed / 60);
    const remainingSeconds = workout.time_elapsed % 60;

    return minutes > 0 ? `${minutes.toString()}m` : `${remainingSeconds.toString().padStart(2, '0')}s`;
};




  return (
    <View className='bg-surface border-2 border-accent/30 rounded-3xl p-5 mb-4 shadow-lg'>
      <TouchableOpacity onPress={() => setShowWorkoutHistory(true)}>

        {/* Header */}
        <View className='flex-row justify-between items-center mb-3'>
          <View className='flex-1'>
            <Text className='text-white font-pbold text-xl mb-1'>{workout.workout_name}</Text>
            <Text className='text-gray-400 font-pmedium text-sm'>
              {dateOfWorkout ? new Date(dateOfWorkout).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }) : ''}
            </Text>
          </View>
          <Menu>
            <MenuTrigger>
              <View className="bg-accent/20 p-3 rounded-xl">
                <AntDesign name="ellipsis1" size={20} color="#6366F1" />
              </View>
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                backgroundColor: '#252D3F',
                borderRadius: 16,
                marginTop: 40,
                borderWidth: 1,
                borderColor: '#6366F1',
              }}
            >
              <MenuOption
                onSelect={() => {
                  Alert.alert("Delete Workout From History", "Are your sure you want to permanately remove this workout and its info. Cannot be reversed",
                    [
                      {
                        text: "Ok",
                        onPress: () => handleDeleteWorkout(workout.id)
                      },
                      {
                        text: "Cancel"
                      }
                    ]
                  )
                }}
                style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
              >
                <AntDesign name="delete" size={20} color="#EF4444" className='mr-2' />
                <Text className="text-white text-base font-pmedium ml-2">Delete</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        {/* Stats Row */}
        <View className='flex flex-row justify-between items-center bg-primary-light rounded-2xl p-4 mb-4'>
          <View className='flex items-center flex-1'>
            <View className='bg-accent/20 rounded-full p-2 mb-2'>
              <AntDesign name="clockcircleo" size={18} color="#6366F1" />
            </View>
            <Text className='text-gray-400 text-xs font-pmedium mb-1'>Duration</Text>
            <Text className='text-white font-pbold text-base'>{formatTime()}</Text>
          </View>

          <View className='w-px h-12 bg-gray-700' />

          <View className='flex items-center flex-1'>
            <View className='bg-accent-green/20 rounded-full p-2 mb-2'>
              <MaterialCommunityIcons name="dumbbell" size={18} color="#10B981" />
            </View>
            <Text className='text-gray-400 text-xs font-pmedium mb-1'>Volume</Text>
            <Text className='text-white font-pbold text-base'>{totalWeight} lb</Text>
          </View>

          <View className='w-px h-12 bg-gray-700' />

          <View className='flex items-center flex-1'>
            <View className='bg-accent-orange/20 rounded-full p-2 mb-2'>
              <AntDesign name="Trophy" size={18} color="#F97316" />
            </View>
            <Text className='text-gray-400 text-xs font-pmedium mb-1'>PRs</Text>
            <Text className='text-white font-pbold text-base'>0</Text>
          </View>
        </View>

        {/* Exercises List */}
        <View className='flex'>
          {exercises.slice(0, 4).map((exercise, index) => {
            // Filter sets for this exercise
            const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);

            // Find the set with the highest weight
            const bestSet = exerciseSets.reduce((maxSet, set) => {
              return set.exercise_weight > (maxSet?.exercise_weight ?? 0) ? set : maxSet;
            }, null as Set | null);

            const numOfSets = exerciseSets.length;

            return (
              <View className='mb-3 bg-primary-light rounded-xl p-3' key={exercise.id}>
                <View className='flex flex-row justify-between items-center'>
                  <View className='flex-1'>
                    <Text className='text-white font-pmedium text-base mb-1'>{exercise.exercise_name}</Text>
                    <Text className='text-gray-400 text-sm font-pmedium'>{numOfSets} sets</Text>
                  </View>

                  <View className='bg-accent/20 rounded-xl px-3 py-2'>
                    <Text className='text-accent font-pbold text-sm'>
                      {bestSet?.exercise_weight} lb × {bestSet?.exercise_reps}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
          {exercises.length > 4 && (
            <Text className='text-accent text-sm font-pmedium text-center mt-2'>+{exercises.length - 4} more exercises</Text>
          )}
        </View>
      </TouchableOpacity>
      {
        showWorkoutHistory && (
          <WorkoutHistoryModal
            sets={sets}
            exercises={exercises}
            workout={workout}
            showWorkoutHistory={showWorkoutHistory}
            setShowWorkoutHistory={setShowWorkoutHistory}
          />
        )
      }
    </View>
  )
}

export default WorkoutHistoryCard

