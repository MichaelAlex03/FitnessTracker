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
    workout_id: number,
    exercise_weight: number
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
    const [elapsedTime, setElapsedTime] = useState(0);


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

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (showWorkout) {
            setElapsedTime(0);
            intervalId = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000)
        }

        return () => {
            clearInterval(intervalId);
        }

    }, [showWorkout])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAddSet = (item: Exercise) => {
        setExerciseSets([...exerciseSets, {
            id: exerciseSets.length + 1,
            exercise_id: item.id,
            exercise_reps: 0,
            exercise_sets: 0,
            workout_id: workoutId,
            exercise_weight: 0
        }])
    }

    const handleRemoveSet = (id: number) => {
        const updatedSets = exerciseSets.filter(set => set.id !== id);
        setExerciseSets(updatedSets);
    }

    const handleSave = async () => {
        setShowWorkout(false)
    }



    const renderItem = (item: Exercise) => {
        // Filter sets for this specific exercise
        const exerciseSetsFiltered = exerciseSets.filter(set => set.exercise_id === item.id);

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

                <View className='mt-4'>
                    {exerciseSetsFiltered.map((set, index) => (
                        <View key={set.id} className='flex flex-row items-center gap-8 py-2'>
                            <Menu>
                                <MenuTrigger>
                                    <View className='flex items-center gap-4 justify-center'>
                                        <Text className='text-white font-semibold text-lg'>Set</Text>
                                        <Text className='text-white font-semibold text-lg bg-secondary/20 px-4 py-1 rounded-lg'>{index + 1}</Text>
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={{
                                        backgroundColor: '#1E1E1E',
                                        borderRadius: 8,
                                        marginTop: 80,
                                    }}
                                >
                                    <MenuOption
                                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                                    >
                                        <View className="bg-blue-500/30 w-8 h-8 rounded-full items-center justify-center">
                                            <Text className="text-blue-500 font-bold">W</Text>
                                        </View>
                                        <Text className="text-white text-base font-semibold">Warmup Set</Text>
                                    </MenuOption>
                                    <MenuOption
                                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                                    >
                                        <View className="bg-purple-500/30 w-8 h-8 rounded-full items-center justify-center">
                                            <Text className="text-purple-500 font-bold">D</Text>
                                        </View>
                                        <Text className="text-white text-base font-semibold">Drop Set</Text>
                                    </MenuOption>
                                    <MenuOption
                                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                                    >
                                        <View className="bg-red-500/30 w-8 h-8 rounded-full items-center justify-center">
                                            <Text className="text-red-500 font-bold">F</Text>
                                        </View>
                                        <Text className="text-white text-base font-semibold">Failure Set</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>

                            <View className='flex items-center gap-4 justify-center'>
                                <Text className='text-white font-semibold text-lg'>Previous Weight</Text>
                                <Text className='text-white font-semibold text-lg px-4 py-1'>0</Text>
                            </View>
                            <View className='flex items-center gap-4 justify-center'>
                                <Text className='text-white font-semibold text-lg'>Reps</Text>
                                <TextInput
                                    className='text-white font-semibold text-lg px-6 py-1 bg-secondary/20 rounded-lg'
                                    placeholder={set.exercise_reps.toString()} />
                            </View>
                            <View className='flex items-center gap-4 justify-center'>
                                <Text className='text-white font-semibold text-lg'>Weight</Text>
                                <TextInput
                                    className='text-white font-semibold text-lg px-6 py-1 bg-secondary/20 rounded-lg '
                                    placeholder={set.exercise_weight.toString()}
                                />
                            </View>

                        </View>
                    ))}

                    <TouchableOpacity
                        className='mt-2 bg-secondary/20 p-2 rounded-xl'
                        onPress={() => { handleAddSet(item) }}
                    >
                        <Text className='text-secondary text-center'>Add Set</Text>
                    </TouchableOpacity>
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
                                        className='bg-gray-400 px-6 py-2 rounded-lg mr-auto'
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

                                <View className='flex flex-col gap-2 mt-10'>
                                    <View className='flex flex-row items-center gap-4'>
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

                                    <View className='flex flex-row items-center gap-2'>
                                        <Icon name="timer" size={20} color="#FF9C01" />
                                        <Text className='text-secondary font-semibold text-lg'>
                                            {formatTime(elapsedTime)}
                                        </Text>
                                    </View>
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