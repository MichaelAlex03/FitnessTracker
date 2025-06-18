import { View, Text } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import WorkoutHistoryCard from '@/components/HistoryScreen/WorkoutHistoryCard';
import useAuth from '@/hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';

const HISTORY_DATA_URL ='/api/history'

interface OldWorkout{

}

interface OldExercise{

}

interface OldSet{

}

const History = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [oldWorkouts, setOldWorkouts] = useState([]);
  const [oldExercises, setOldExercises] = useState([]);
  const [oldSets, setOldSets] = useState([]);

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

      <View className='flex-1 mt-10'>
        <WorkoutHistoryCard />
      </View>
    </SafeAreaView>
  )
}

export default History