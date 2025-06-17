import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import WorkoutHistoryCard from '@/components/HistoryScreen/WorkoutHistoryCard';
import useAuth from '@/hooks/useAuth';

const WORKOUT_HISTORY_URL = '/api/history/workouts';
const EXERCISE_HISTORY_URL = '/api/history/exercises'
const SET_HISTORY_URL = '/api/history/sets'

const History = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [oldWorkouts, setOldWorkouts] = useState([]);
  const [oldExercises, setOldExercises] = useState([]);
  const [oldSets, setOldSets] = useState([]);

  const fetchWorkoutHistory = async () => {
    try {

    } catch (error) {

    }
  }

  const fetchExerciseHistory = async () => {
    try {

    } catch (error) {

    }
  }


  const fetchSetHistory = async () => {
    try {

    } catch (error) {

    }
  }

  useEffect(() => {
    fetchWorkoutHistory();
    fetchExerciseHistory();
    fetchSetHistory();
  }, [])


  return (
    <SafeAreaView className="bg-primary flex-1 p-8">
      <Text className='text-white font-bold text-4xl'>History</Text>

      <View className='flex-1 mt-10'>
        <WorkoutHistoryCard />
      </View>
    </SafeAreaView>
  )
}

export default History