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
  user_id: string,
  time_elapsed: number
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
  user_id: string,
  exercise_name: string
}

const History = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [oldWorkouts, setOldWorkouts] = useState<OldWorkout[]>([]);
  const [oldExercises, setOldExercises] = useState<OldExercise[]>([]);
  const [oldSets, setOldSets] = useState<OldSet[]>([]);
  const [refresh, setRefresh] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [renderDate, setRenderDate] = useState<boolean>(false);


  const fetchWorkoutHistory = async () => {
    try {
      const workoutHistoryData = await axiosPrivate.get(`${HISTORY_DATA_URL}/${auth.userId}`);

      console.log(workoutHistoryData.data)

      const sortedWorkouts = [...workoutHistoryData.data.workouts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )


      setOldWorkouts(sortedWorkouts);
      setOldExercises(workoutHistoryData.data.exercises);
      setOldSets(workoutHistoryData.data.sets)
    } catch (error) {

    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutHistory();
    }, [refresh])
  );


  return (
    <SafeAreaView className="bg-primary flex-1 p-8">
      <Text className='text-white font-bold text-4xl mb-3'>History</Text>

      <FlatList
        data={oldWorkouts}
        renderItem={({ item, index }) => {

          const workoutExercises = oldExercises.filter(exercise => exercise.workout_id === item.id)
          const workoutSets = oldSets.filter(set => set.workout_id === item.id);

          const date = new Date(item.created_at);
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();

          if (index === 0){
            setCurrentMonth(month);
            setCurrentYear(year);
          } else if(month != currentMonth || year != currentYear){
            setCurrentMonth(month);
            setCurrentYear(year);
            setRenderDate(true);
          } else {
            setRenderDate(false)
          }


          return (
            <View className='mt-5 gap-4'>
              {(index === 0 || renderDate) && (
                <Text className='text-white font-bold text-2xl'>{currentMonth} {currentYear}</Text>
              )}
              <WorkoutHistoryCard
                workout={item}
                sets={workoutSets}
                exercises={workoutExercises}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </View>
          )
        }}
        keyExtractor={(item) => item.id.toString()}
      />
      <StatusBar className='bg-white' />
    </SafeAreaView>
  )
}

export default History