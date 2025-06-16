import { Text, View, FlatList, Modal, TextInput, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context'
import usefetchWorkouts from '@/hooks/usefetchWorkouts'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenamePopup from '@/components/RenamePopup';
import EditWorkout from '@/components/EditWorkout';
import WorkoutScreen from '@/components/WorkoutScreen/WorkoutScreen';
import CreateWorkout from '@/components/CreateWorkout';


const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';
const SETS_URL = '/api/sets';



interface Exercise {
  exercise_name: string,
  exercise_category: string,
  exercise_instructions: string,
  id: string
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
  const [activeWorkout, setActiveWorkout] = useState(0);
  const [showRename, setShowRename] = useState(false);
  const [editWorkout, setEditWorkout] = useState(false);
  const [workoutName, setWorkoutName] = useState('');


  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  let workouts = usefetchWorkouts(auth.userId, refresh);

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


  const handleDeleteWorkout = async (id: number) => {

    try {
      //Delete all sets
      await axiosPrivate.delete(SETS_URL, {
        params: {
          workoutId: id
        }
      })

      //Delete all exercises
      await axiosPrivate.delete(EXERCISES_URL, {
        params: {
          workoutId: id
        }
      })

      //Delete workout
      await axiosPrivate.delete(WORKOUT_URL, {
        params: {
          workoutId: id
        }
      })


      setRefresh(refresh + 1)

    } catch (error) {
      Alert.alert("Error Deleting Workout", "There was a problem deleting the workout, please try again later");
      console.log(error)
    }

  }

  const handleOpenWorkout = (id: number, workoutName: string) => {
    setWorkoutName(workoutName)
    setActiveWorkout(id);
    setShowWorkout(true)
  }

  const handleRename = (id: number, workoutName: string) => {
    setShowRename(true)
    setActiveWorkout(id)
    setWorkoutName(workoutName)
  }

  const handleEditWorkout = (id: number, workoutName: string) => {
    setEditWorkout(true);
    setActiveWorkout(id)
    setWorkoutName(workoutName)
  }


  const workoutItem = (item: Workout) => {
    return (
      <TouchableOpacity
        className="bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
        onPress={() => handleOpenWorkout(item.id, item.workout_name)}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-lg font-pmedium mb-1">
              {item.workout_name}
            </Text>
          </View>

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
                onSelect={() => handleDeleteWorkout(item.id)}
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
              >
                <AntDesign name="delete" size={20} color="red" className='mr-2' />
                <Text className="text-white text-base">Delete</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  handleRename(item.id, item.workout_name)
                }}
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon name="edit" size={20} color="white" className='mr-2' />
                <Text className="text-white text-base">Rename</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => handleEditWorkout(item.id, item.workout_name)}
                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon name="edit" size={20} color="white" className='mr-2' />
                <Text className="text-white text-base">Edit Workout</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </TouchableOpacity>
    );
  };


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
        showWorkout && <WorkoutScreen showWorkout={showWorkout} setShowWorkout={setShowWorkout} workoutId={activeWorkout} setActiveWorkout={setActiveWorkout} workoutName={workoutName} />
      }
      {
        showRename && <RenamePopup showRename={showRename} setShowRename={setShowRename} workoutId={activeWorkout} refresh={refresh} setRefresh={setRefresh} currentWorkoutName={workoutName} setCurrentWorkoutName={setWorkoutName} />
      }
      {
        editWorkout && <EditWorkout editWorkout={editWorkout} setEditWorkout={setEditWorkout} workoutId={activeWorkout} setActiveWorkout={setActiveWorkout} refresh={refresh} setRefresh={setRefresh} workoutName={workoutName} />
      }

    </SafeAreaView>
  )
}


