import { Text, View, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenamePopup from '@/components/RenamePopup';


const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';
const SETS_URL = '/api/sets';

interface WorkoutScreenProps {
    showWorkout: boolean,
    setShowWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number,
    setActiveWorkout: React.Dispatch<React.SetStateAction<number>>,
    workoutName: string
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

interface Sets {
    id: number,
    exercise_id: number,
    exercise_reps: number,
    exercise_sets: number,
    workout_id: number
}

const WorkoutScreen = ({ showWorkout, setShowWorkout, workoutId, setActiveWorkout, workoutName }: WorkoutScreenProps) => {

    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseSets, setExerciseSets] = useState<Sets[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [toggleAddExercise, setToggleAddExercise] = useState(false);
    const [refreshSet, setRefreshSet] = useState(0);
    const [refreshExercise, setRefreshExercise] = useState(0);
    const [editWorkoutName, setEditWorkoutName] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const options = ["Delete Exercise", "View Exercise History"];

    const axiosPrivate = useAxiosPrivate();


    /* Retrieves exercises for the workout */
    useEffect(() => {
        const fetchExercises = async () => {

            try {
                const exerciseData = await axiosPrivate.get(EXERCISES_URL + `/getWorkoutExercises/${workoutId}`);
                setExercises(exerciseData.data.exercises);
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        fetchExercises();
    }, []);

    /* Retrieves sets for the workout */
    useEffect(() => {
        const fetchSets = async () => {
            try {
                const setsData = await axiosPrivate.get(SETS_URL + `/getAllSets/${workoutId}`);
                setExerciseSets(setsData.data.sets);
            } catch (error) {
                console.error('Error fetching sets:', error);
            }
        }
        fetchSets();
    }, []);


    const handleAddSet = () => {

    }

    const handleRemoveSet = () => {

    }

    const handleSave = async () => {
        setShowWorkout(false)
    }

    const renderItem = (item: Exercise) => {
        return (
            <View className='p-6'>

                <View className='flex flex-row items-center'>
                    <TouchableOpacity className='mr-auto'>
                        <Text className='text-secondary font-semibold text-2xl'>{item.exercise_name}</Text>
                    </TouchableOpacity>
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
                                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <AntDesign name="delete" size={20} color="red" className='mr-2' />
                                <Text className="text-white text-base">Remove Exercise</Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => {

                                }}
                                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Icon name="edit" size={20} color="white" className='mr-2' />
                                <Text className="text-white text-base">Replace Exercise</Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => { }}
                                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Icon name="edit" size={20} color="white" className='mr-2' />
                                <Text className="text-white text-base">History</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </View>
        )
    }


    return (
        <Modal
            visible={showWorkout}
            animationType="slide"
            onRequestClose={() => {
                setShowWorkout(false)
                setActiveWorkout(0)
            }}
        >
            <SafeAreaView className="flex-1 bg-primary">
                <MenuProvider skipInstanceCheck={true}>
                    <FlatList
                        data={exercises}
                        renderItem={({ item }) => renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={() => (
                            <View className='px-6 py-6 gap-4 mt-5'>
                                <View className="flex flex-row justify-evenly items-center">
                                    <TouchableOpacity
                                        className=' bg-gray-400 px-6 py-2 rounded-lg mr-auto'
                                        onPress={() => {
                                            setShowWorkout(false)
                                            setActiveWorkout(0)
                                        }}
                                    >
                                        <Icon name="close" size={20} color="#000000" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className='bg-secondary px-4 py-2 rounded-lg'
                                        onPress={() => {
                                            setShowWorkout(false)
                                            setActiveWorkout(0)
                                        }}
                                    >
                                        <Text className='text-xl text-white'>Finish</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='flex flex-row items-center gap-4 mt-10'>
                                    <TextInput className='text-white font-bold text-2xl' editable={false}>{workoutName}</TextInput>
                                    <Menu>
                                        <MenuTrigger>
                                            <View className="bg-secondary/20 p-2 rounded-xl">
                                                <AntDesign name="ellipsis1" size={16} color="#FF9C01" />
                                            </View>
                                        </MenuTrigger>
                                        <MenuOptions
                                            optionsContainerStyle={{
                                                backgroundColor: '#1E1E1E',
                                                borderRadius: 8,
                                                marginTop: 40,
                                                zIndex: 10000,
                                            }}
                                        >
                                            <MenuOption
                                                onSelect={() => {
                                                    setEditWorkoutName(true)
                                                }}
                                                style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                                            >
                                                <Icon name="edit" size={20} color="white" className='mr-2' />
                                                <Text className="text-white text-base">Rename Workout</Text>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>
                        )}
                    />
                </MenuProvider>
                {
                    editWorkoutName && <RenamePopup showRename={editWorkoutName} setShowRename={setEditWorkoutName} workoutId={workoutId} refresh={refresh} setRefresh={setRefresh} />
                }
            </SafeAreaView>

        </Modal>
    )
}

export default WorkoutScreen