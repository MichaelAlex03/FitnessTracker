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
import CreateWorkout from '@/components/WorkoutScreen/CreateWorkout';
import DeleteWorkoutPopup from '@/components/WorkoutScreen/DeleteWorkoutPopop';
import ProBenefits from '@/components/ProBenefits';
import WorkoutTemplates from '@/components/WorkoutTemplates';


const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';
const SETS_URL = '/api/sets';



interface Exercise {
  exercise_name: string
  exercise_category: string
  exercise_bodypart: string
  exercise_instructions: string
  user_id: string
  id: string
}

interface Workout {
  id: number,
  workout_name: string,
  user_id: string
}

interface WorkoutTemplate {
  id: number
  workout_name: string
}

interface TemplateExercises {
  id: number
  exercise_name: string
  workout_template_id: number
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
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [templateExercises, setTemplateExercises] = useState<TemplateExercises[]>([]);

  const [workoutToDelete, setWorkoutToDelete] = useState<number>(0)
  const [showDeleteWorkoutPopup, setShowDeleteWorkoutPopup] = useState<boolean>(false);

  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);


  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  let workouts = usefetchWorkouts(auth.userId, refresh);

  //Function to fetch exercises users can choose from
  const fetchExercises = async () => {
    try {
      const response = await axiosPrivate.get(`${EXERCISES_URL}/${auth.userId}`);
      setExercises(response.data.exercises);
    } catch (error) {
      console.error(error)
    }
  }


  const fetchTemplates = async () => {
    try {
      const response = await axiosPrivate.get('/api/templates')
      setWorkoutTemplates(response.data.templates)
      setTemplateExercises(response.data.templateExercises)
    } catch (error) {
      console.error(error);
    }
  }

  //On mount retrieve the exercises the users can select from
  useEffect(() => {
    fetchExercises();
    fetchTemplates();

  }, [refresh]);


  


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

      setShowDeleteWorkoutPopup(false)
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
        className="bg-surface mx-4 mb-4 rounded-3xl p-3 border-2 border-accent/20 active:scale-[0.98] shadow-lg"
        onPress={() => handleOpenWorkout(item.id, item.workout_name)}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 flex-row items-center">

            <View className="bg-accent/20 rounded-2xl p-2 mr-4">
              <Icon name="fitness-center" size={24} color="#6366F1" />
            </View>

            <View className="flex-1">
              <Text className="text-white text-xl font-pbold mb-1">
                {item.workout_name}
              </Text>
              <Text className="text-gray-400 text-sm font-pmedium">
                Tap to start workout
              </Text>
            </View>
          </View>

          <Menu>
            <MenuTrigger
              customStyles={{
                triggerTouchable: { underlayColor: 'transparent' },
                triggerWrapper: {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  padding: 8,
                  borderRadius: 12,
                }
              }}
            >
              <AntDesign name="ellipsis1" size={20} color="#6366F1" />

            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                backgroundColor: '#252D3F',
                borderRadius: 16,
                marginTop: 40,
                borderWidth: 1,
                borderColor: '#6366F1',
                shadowColor: '#6366F1',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <MenuOption
                onSelect={() => {
                  setShowDeleteWorkoutPopup(true)
                  setWorkoutToDelete(item.id)
                }}
                style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
              >
                <AntDesign name="delete" size={20} color="#EF4444" className='mr-2' />
                <Text className="text-white text-base font-pmedium ml-2">Delete</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  handleRename(item.id, item.workout_name)
                }}
                style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
              >
                <Icon name="edit" size={20} color="#6366F1" className='mr-2' />
                <Text className="text-white text-base font-pmedium ml-2">Rename</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => handleEditWorkout(item.id, item.workout_name)}
                style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
              >
                <Icon name="edit" size={20} color="#6366F1" className='mr-2' />
                <Text className="text-white text-base font-pmedium ml-2">Edit Workout</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <MenuProvider>
      <SafeAreaView className="bg-primary flex-1">
        <StatusBar className='bg-white' />

        <FlatList
          data={workouts}
          renderItem={({ item }) => workoutItem(item)}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <View className='flex-1 px-5 pt-6 pb-4'>

              <View className='mb-8'>
                <Text className='font-pmedium text-base text-gray-400 mb-1'>Welcome Back</Text>
                <Text className='text-white font-pextrabold text-4xl tracking-tight'>{auth?.user}</Text>
                <View className='flex-row items-center mt-2'>
                  <View className='bg-success/20 rounded-full px-3 py-1'>
                    <Text className='text-success text-xs font-pbold'>Ready to train</Text>
                  </View>
                </View>
              </View>


              <View className='bg-gradient-to-br from-accent/10 to-accent-purple/10 rounded-3xl p-6 mb-6 border-2 border-accent/30'>
                <View className='flex-row items-center mb-4'>
                  <View className='bg-accent rounded-full p-2 mr-3'>
                    <Icon name="add" size={24} color="white" />
                  </View>
                  <Text className='text-white font-pbold text-2xl flex-1'>Quick Start</Text>
                </View>

                <TouchableOpacity
                  className='w-full bg-accent rounded-2xl p-2 active:scale-95 shadow-lg shadow-accent/40 mb-3'
                  onPress={() => {
                    if (auth.isPaid === false && workouts.length === 6) {
                      Alert.alert("Too many exercises", "To make unlimited exercises upgrade to pro!",
                        [{
                          text: 'Ok'
                        },
                        {
                          text: 'Upgrade',
                          onPress: () => setShowProModal(true)
                        },]
                      )
                      return;
                    }
                    setShowCreateWorkout(true)
                  }}
                >
                  <View className='flex-row items-center justify-center'>
                    <Icon name="add" size={20} color="white" style={{ marginRight: 8 }} />
                    <Text className='text-white text-center font-pbold text-lg'>Create New Workout</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className='w-full bg-surface border-2 border-accent/30 rounded-2xl p-2 active:scale-95'
                  onPress={() => {
                    if (auth.isPaid === false && workouts.length === 6) {
                      Alert.alert("Too many exercises", "To make unlimited exercises upgrade to pro!",
                        [{
                          text: 'Ok'
                        },
                        {
                          text: 'Upgrade',
                          onPress: () => setShowProModal(true)
                        },]
                      )
                      return;
                    }
                    setShowTemplatesModal(true)
                  }
                  }
                >
                  <View className='flex-row items-center justify-center'>
                    <Icon name="content-copy" size={20} color="#6366F1" style={{ marginRight: 8 }} />
                    <Text className='text-accent text-center font-pbold text-lg'>Build from Template</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <View className='flex-row justify-between items-center mb-4'>
                <Text className='text-white font-pbold text-2xl'>My Workouts</Text>
                <View className='bg-accent/20 rounded-full px-3 py-1'>
                  <Text className='text-accent text-xs font-pbold'>{workouts.length} total</Text>
                </View>
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
        {
          showDeleteWorkoutPopup && <DeleteWorkoutPopup workout_id={workoutToDelete} visible={showDeleteWorkoutPopup} setVisible={setShowDeleteWorkoutPopup} onSubmit={handleDeleteWorkout} />
        }
        {
          showProModal && (
            <ProBenefits showProModal={showProModal} setShowProModal={setShowProModal} />
          )
        }
        {
          showTemplatesModal && (
            <WorkoutTemplates
              visible={showTemplatesModal}
              onClose={() => setShowTemplatesModal(false)}
              workoutTemplates={workoutTemplates}
              workoutTemplateExercises={templateExercises}
              refresh={refresh}
              setRefresh={setRefresh}

            />
          )
        }


      </SafeAreaView>
    </MenuProvider>
  )
}


