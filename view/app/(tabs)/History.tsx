import { View, Text, FlatList, StatusBar } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import WorkoutHistoryCard from '@/components/HistoryScreen/WorkoutHistoryCard';
import useAuth from '@/hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import WorkoutHistoryModal from '@/components/HistoryScreen/WorkoutHistoryModal';

const HISTORY_DATA_URL = '/api/history'

interface OldWorkout {
  id: number
  created_at: Date
  workout_name: string
  user_id: string
}

interface OldExercise {
  id: number
  exercise_name: string
  workout_id: number
  user_id: string
}

interface OldSet {
  id: string
  exercise_id: number
  exercise_reps: number
  exercise_weight: number
  workout_id: number
  set_type: string
  user_id: string
}

const History = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [oldWorkouts, setOldWorkouts] = useState<OldWorkout[]>([]);
  const [oldExercises, setOldExercises] = useState<OldExercise[]>([]);
  const [oldSets, setOldSets] = useState<OldSet[]>([]);
  

  const fetchWorkoutHistory = async () => {
    try {
      const workoutHistoryData = await axiosPrivate.get(`${HISTORY_DATA_URL}/${auth.userId}`);

      console.log(workoutHistoryData.data)

      setOldWorkouts(workoutHistoryData.data.workouts);
      setOldExercises(workoutHistoryData.data.exercises);
      setOldSets(workoutHistoryData.data.sets)
    } catch (error) {

    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutHistory();
    }, [])
  );


  return (
    <SafeAreaView className="bg-primary flex-1 p-8">
      <Text className='text-white font-bold text-4xl'>History</Text>

      <FlatList
        data={oldWorkouts}
        renderItem={({ item }) => {
          const workoutExercises = oldExercises.filter(exercise => exercise.workout_id === item.id)
          const workoutSets = oldSets.filter(set => set.workout_id === item.id);

          return (
            <WorkoutHistoryCard
              workout={item}
              sets={workoutSets}
              exercises={workoutExercises}
            />
          )
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      <StatusBar className='bg-white'/>
    </SafeAreaView>
  )
}

export default History