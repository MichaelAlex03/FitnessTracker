import { Text, View, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context'
import usefetchWorkouts from '@/hooks/usefetchWorkouts'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { AxiosError } from 'axios';


const EXERCISES_URL = '/api/exercises';
const CREATE_WORKOUT_URL = '/api/workouts'


interface CreateWorkoutProps {
  showCreateWorkout: boolean,
  setShowCreateWorkout: React.Dispatch<React.SetStateAction<boolean>>,
  exercises: Exercise[],
  setRefresh: React.Dispatch<React.SetStateAction<number>>
  refresh: number
}

interface WorkoutScreenProps {
  showWorkout: boolean,
  setShowWorkout: React.Dispatch<React.SetStateAction<boolean>>,
}

interface Exercise {
  id: number,
  exercise_name: string,
  user_id: string
}

interface Workout {
  id: number,
  workout_name: string,
  user_id: string
}

export default function Workouts() {
  const [refresh, setRefresh] = useState(0);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showWorkout, setShowWorkout] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

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

  const workouts = usefetchWorkouts(auth.userId, refresh);
  console.log("workouts", workouts)

  const workoutItem = (item: Workout) => {
    return (
      <TouchableOpacity
        className="bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-lg font-pmedium mb-1">
              {item.workout_name}
            </Text>

          </View>

          <TouchableOpacity className="bg-secondary/20 p-4 rounded-xl">
            <AntDesign
              name="delete"
              size={20}
              color="#FF9C01" // Your secondary accent color
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <SafeAreaView className="bg-primary flex-1">

      <FlatList
        data={workouts}
        renderItem={({ item }) => workoutItem(item)}
        keyExtractor={(item) => item.id.toString()}
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
        showCreateWorkout &&
        <CreateWorkout
          showCreateWorkout={showCreateWorkout}
          setShowCreateWorkout={setShowCreateWorkout}
          exercises={exercises}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      }
      {
        showWorkout && <WorkoutScreen showWorkout={showWorkout} setShowWorkout={setShowWorkout} />
      }

    </SafeAreaView>
  )
}


//Create Workout Modal
const CreateWorkout = ({ showCreateWorkout, setShowCreateWorkout, exercises, setRefresh, refresh }: CreateWorkoutProps) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>({} as Exercise);
  const [workoutName, setWorkoutName] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const exerciseNames = exercises.map((ex, i) => ({
    exercise_name: ex.exercise_name,
    value: i.toString()
  }));

  const handleCreateWorkout = async () => {
    // Your code here
    if (selectedExercises.length == 0) {
      Alert.alert("No Workouts Selected", "Please select at least one exercise to create a workout");
      return;
    }

    if (!workoutName) {
      Alert.alert("No Workout Name", "Please enter in a workout name");
      return;
    }

    try {
      const response = await axiosPrivate.post(CREATE_WORKOUT_URL, {
        userId: auth.userId,
        workoutName,
      })

      const workoutId = response.data.workoutId;
      setRefresh(refresh + 1);
      setShowCreateWorkout(false);
    } catch (err) {
      console.error(err)
    }
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

  const handleAddExercise = (item: Exercise) => {

    const found = selectedExercises.find(exercise => exercise.exercise_name === item.exercise_name);
    if (found) {
      Alert.alert("Duplicate Exercise", "You have already added this exercise to the workout");
      return;
    }
    setSelectedExercises([...selectedExercises, item]);
    setSelectedExercise(item);
  }

  const handleRemoveExercise = (name: string) => {
    const updatedExercises = selectedExercises.filter((exercise) => exercise.exercise_name !== name);
    setSelectedExercises(updatedExercises);
  }


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

          <View className='mb-2 flex gap-4'>
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
              labelField="exercise_name"
              valueField="value"
              onChange={(item) => {
                console.log("ITEM", item)
                handleAddExercise(item)
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
              onPress={handleCreateWorkout}
              className='bg-[#25344d] rounded-2xl py-4 '
            >
              <Text className='text-white text-center font-bold'>Create Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCreateWorkout(false)}
              className='bg-secondary py-4 rounded-2xl'
            >
              <Text className='text-white text-center font-bold'>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};


//Workout Screen Modal
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



