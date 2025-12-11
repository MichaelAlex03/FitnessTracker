import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import WorkoutHistoryCard from '@/components/HistoryScreen/WorkoutHistoryCard';
import useAuth from '@/hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import WorkoutHistoryModal from '@/components/HistoryScreen/WorkoutHistoryModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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


  useFocusEffect(
    useCallback(() => {
      const fetchWorkoutHistory = async () => {
        try {
          const workoutHistoryData = await axiosPrivate.get(`${HISTORY_DATA_URL}/${auth.userId}`);

          const sortedWorkouts = [...workoutHistoryData.data.workouts].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )

          setOldWorkouts(sortedWorkouts);
          setOldExercises(workoutHistoryData.data.exercises);
          setOldSets(workoutHistoryData.data.sets)
        } catch (error) {

        }
      }

      fetchWorkoutHistory();
    }, [refresh])
  );


  return (
    <SafeAreaView className="bg-primary flex-1" edges={['top', 'left', 'right']}>

      <View className='px-6 pt-6 pb-4'>
        <Text className='text-white font-pextrabold text-4xl mb-2'>Workout History</Text>
        <Text className='text-gray-400 font-pmedium text-base'>Track your fitness journey</Text>
      </View>

      <FlatList
        data={oldWorkouts}
        renderItem={({ item, index }) => {

          const workoutExercises = oldExercises.filter(exercise => exercise.workout_id === item.id)
          const workoutSets = oldSets.filter(set => set.workout_id === item.id);

          const date = new Date(item.created_at);
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();

          let showDateHeader = false
          if (index === 0) {
            showDateHeader = true;
          } else {
            const prevDate = new Date(oldWorkouts[index - 1].created_at);
            const prevMonth = prevDate.toLocaleString('default', { month: 'long' });
            const prevYear = prevDate.getFullYear();
            showDateHeader = (month !== prevMonth || year !== prevYear);
          }


          return (
            <View className='mt-2 px-6'>
              {showDateHeader && (
                <View className='bg-surface rounded-2xl px-4 py-3 mb-4 border-l-4 border-accent'>
                  <Text className='text-white font-pbold text-xl'>{month} {year}</Text>
                </View>
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
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className='flex-1 justify-center items-center px-8 py-20'>
            
            <View className='bg-accent/10 rounded-full p-8 mb-6'>
              <MaterialCommunityIcons
                name="history"
                size={80}
                color="#6366F1"
              />
            </View>

           
            <Text className='text-white text-3xl font-pextrabold text-center mb-3'>
              No Workout History
            </Text>

            
            <Text className='text-gray-400 text-base font-pmedium text-center mb-8 leading-6'>
              Your completed workouts will appear here. Start your fitness journey by completing your first workout!
            </Text>

            
            <View className='w-full bg-surface border-2 border-accent/20 rounded-2xl p-6 mb-6'>
              <View className='flex-row items-center mb-3'>
                <MaterialCommunityIcons name="chart-line" size={24} color="#6366F1" />
                <Text className='text-white font-pbold text-lg ml-3'>
                  Track Your Progress
                </Text>
              </View>
              <Text className='text-gray-400 font-pmedium text-sm leading-5'>
                Complete workouts to see stats like volume, duration, personal records, and workout frequency over time.
              </Text>
            </View>

            {/* Call to Action Hints */}
            <View className='w-full gap-3'>
              <View className='bg-surface/50 border border-accent/30 rounded-xl p-4 flex-row items-center'>
                <MaterialCommunityIcons name="dumbbell" size={20} color="#6366F1" />
                <Text className='text-gray-300 font-pmedium text-sm ml-3 flex-1'>
                  Go to Workouts tab to start a new session
                </Text>
              </View>

              <View className='bg-surface/50 border border-accent/30 rounded-xl p-4 flex-row items-center'>
                <MaterialCommunityIcons name="robot-excited-outline" size={20} color="#6366F1" />
                <Text className='text-gray-300 font-pmedium text-sm ml-3 flex-1'>
                  Try the AI Coach to generate custom workouts
                </Text>
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default History