import { Text, ScrollView, View, FlatList, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context'
import fetchUserInfo from '@/hooks/fetchUserInfo'
import fetchWorkouts from '@/hooks/fetchWorkouts'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';

const EXERCISES_URL = '/api/exercises';

interface Exercise {
  exercise_name: string
}

interface CreateWorkoutProps {
  showCreateWorkout: boolean,
  setShowCreateWorkout: React.Dispatch<React.SetStateAction<boolean>>,
  exercises: Exercise[]
}

interface WorkoutScreenProps {
  showWorkout: boolean,
  setShowWorkout: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Workouts() {
  const [refresh, setRefresh] = useState(0);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showWorkout, setShowWorkout] = useState(false);
  const [exercises, setExercises] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  //Function to fetch exercises users can choose from
  const fetchExercises = async () => {
    try {
      const response = await axiosPrivate.get(EXERCISES_URL);
      setExercises(response.data.exercises);
    } catch (error) {
      console.error(error)
    }
  }

  //On mount retrieve the exercises the users can select from
  useEffect(() => {
    fetchExercises();
  }, [])

  console.log(exercises)

  // const workouts  = fetchWorkouts(auth.userId);
  // console.log("workouts", workouts)
  const workoutItem = () => {

  }


  return (
    <SafeAreaView className="bg-primary flex-1">

      {/* <FlatList
        data={exercises}
        renderItem={}
        keyExtractor={}
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
      /> */}
      {
        showCreateWorkout &&
        <CreateWorkout
          showCreateWorkout={showCreateWorkout}
          setShowCreateWorkout={setShowCreateWorkout}
          exercises={exercises}
        />
      }
      {
        showWorkout && <WorkoutScreen showWorkout={showWorkout} setShowWorkout={setShowWorkout} />
      }

    </SafeAreaView>
  )
}

const CreateWorkout = ({ showCreateWorkout, setShowCreateWorkout, exercises }: CreateWorkoutProps) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [workoutName, setWorkoutName] = useState('');

  const exerciseNames = exercises.map((ex, i) => ({
    exercise_name: ex.exercise_name,
    value: i.toString()
  }));

  const handleCreateWorkout = () => {
    // Your code here
  }


  //Exercise item for the selected exercises list
  const exerciseItem = (name: string, id: number) => {
    return (
      <View key={id} className='bg-black-100 rounded-2xl p-4 border border-black-200 active:opacity-80 w-full flex flex-row justify-between'>
        <Text className='text-white'>{name}</Text>

        <TouchableOpacity onPress={() => handleRemoveExercise(name)}>
          <AntDesign name="delete" size={20} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    )
  }

  const handleAddExercise = () => {

  }

  const handleRemoveExercise = (name: string) => {
    const updatedExercises = selectedExercises.filter((exercise) => exercise.exercise_name !== name);
    setSelectedExercises(updatedExercises)
  }

  console.log("Selected Ex", selectedExercises)

  return (
    <Modal
      visible={showCreateWorkout}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreateWorkout(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className='bg-primary w-full p-6 rounded-3xl'>
          <Text className='text-white text-2xl font-bold mb-4 text-center'>Create a new workout</Text>

          <Text className='text-white text-base mb-1'>Workout Name</Text>
          <View className='border border-gray-600 w-full h-16 px-4 bg-black/20 rounded-2xl flex flex-row items-center mt-1 mb-6'>
            <TextInput
              value={workoutName}
              onChangeText={(e) => setWorkoutName(e)}
              placeholder="Enter workout name"
              placeholderTextColor="#94a3b8"
              className="text-white w-full"
            />
          </View>

          <View className='mb-4 flex gap-4'>
            {selectedExercises.length > 0 &&
              selectedExercises.map((exercise, i) => {
                return exerciseItem(exercise.exercise_name, i)
              })
            }
          </View>

          <Text className='text-white text-base mb-1'>Select Exercise</Text>
          <View className='w-full mb-4'>
            <Dropdown
              data={exerciseNames}
              value={selectedExercise}
              maxHeight={300}
              placeholder='Select an exercise'
              labelField="exerciseName"
              valueField="value"
              onChange={(item) => {
                setSelectedExercises([...selectedExercises, item]);
                setSelectedExercise(item);
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#475569',
                height: 50,
              }}
              containerStyle={{
                backgroundColor: '#1e293b',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#475569',
                marginTop: 8,
              }}
              placeholderStyle={{
                color: 'black',
                fontSize: 16,
              }}
              selectedTextStyle={{
                color: 'black',
                fontSize: 16,
                fontWeight: '500',
              }}
              itemTextStyle={{
                color: '#e2e8f0',
                fontSize: 16,
              }}
              itemContainerStyle={{
                paddingVertical: 5,
                paddingHorizontal: 8,
                borderRadius: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#334155',
              }}
              activeColor="#334155"
              iconStyle={{
                width: 20,
                height: 20,
                tintColor: '#94a3b8',
              }}
            />
          </View>

          <View className='flex gap-5 mt-2'>
            <TouchableOpacity
              onPress={() => setShowCreateWorkout(false)}
              className='bg-secondary rounded-2xl py-4 '
            >
              <Text className='text-white text-center font-bold'>Add Exercise</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCreateWorkout(false)}
              className='bg-black py-4 rounded-2xl'
            >
              <Text className='text-white text-center font-bold'>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const WorkoutScreen = ({ showWorkout, setShowWorkout }: WorkoutScreenProps) => {
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



