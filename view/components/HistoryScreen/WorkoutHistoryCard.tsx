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
  user_id: string
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
  user_id: string
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

  const dateOfWorkout = workout.created_at;
  const totalWeight = sets.reduce((sum, set) => sum + set.exercise_weight, 0);
  const [showWorkoutHistory, setShowWorkoutHistory] = useState(false);


  return (
    <View className='bg-primary border-2 border-secondary/40 rounded-2xl p-4 mt-10'>
      <TouchableOpacity onPress={() => setShowWorkoutHistory(true)}>

        <View className='flex-row justify-between items-center'>
          <Text className='text-white font-bold text-lg'>{workout.workout_name}</Text>
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
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
              >
                <AntDesign name="delete" size={20} color="red" className='mr-2' />
                <Text className="text-white text-base">Delete</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <Text className='text-white font-semibold text-md'>
          {dateOfWorkout ? new Date(dateOfWorkout).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) : ''}
        </Text>

        <View className='flex flex-row justify-between items-center mt-5'>
          <View className='flex flex-row items-center'>
            <AntDesign name="clockcircleo" size={20} color="white" className='mr-2' />
            <Text className='text-white'>51m</Text>
          </View>

          <View className='flex flex-row items-center'>
            <MaterialCommunityIcons name="dumbbell" size={20} color="white" className='mr-2' />
            <Text className='text-white'>{totalWeight} lb</Text>
          </View>

          <View className='flex flex-row items-center'>
            <AntDesign name="Trophy" size={20} color="white" className='mr-2' />
            <Text className='text-white'>0 PRs</Text>
          </View>
        </View>

        <View className='flex mt-5'>
          {exercises.slice(0, 4).map((exercise, index) => {
            // Filter sets for this exercise
            const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);

            // Find the set with the highest weight
            const bestSet = exerciseSets.reduce((maxSet, set) => {
              return set.exercise_weight > (maxSet?.exercise_weight ?? 0) ? set : maxSet;
            }, null as Set | null);

            const numOfSets = exerciseSets.length;

            return (
              <View className='mb-2' key={exercise.id}>

                <View className='flex flex-row'>
                  <View className='flex-1'>
                    {index === 0 && <Text className='text-white font-bold mb-2'>Exercises</Text>}
                    <Text className='text-white'>{numOfSets} x {exercise.exercise_name}</Text>
                  </View>

                  <View className='flex-1'>
                    {index === 0 && <Text className='text-white font-bold mb-2'>Weight</Text>}
                    <Text className='text-white'>
                      {bestSet?.exercise_weight}lb x {bestSet?.exercise_reps} reps
                    </Text>
                  </View>
                </View>

              </View>
            );
          })}
          {exercises.length > 4 && (
            <Text className='text-white italic'>...and more</Text>
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

