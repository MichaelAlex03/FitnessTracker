import { Text, View, FlatList, Modal, TextInput, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenderSet from '@/components/WorkoutScreen/RenderSet';
import ExerciseListPopup from '@/components/WorkoutScreen/ExerciseListPopup';
import uuid from 'react-native-uuid';
import useAuth from '@/hooks/useAuth'
import CompletedWorkout from './CompletedWorkout'
import ExerciseHistory from '../ExerciseHistory'


const EXERCISES_URL = '/api/exercises';
const SETS_URL = '/api/sets';
const PREVIOUS_SETS_URL = '/api/history/sets'

interface WorkoutScreenProps {
    showWorkout: boolean,
    setShowWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number,
    setActiveWorkout: React.Dispatch<React.SetStateAction<number>>,
    workoutName: string
}

interface HistorySet {
    id: string
    exercise_id: number
    exercise_reps: number
    workout_id: number
    exercise_weight: number
    set_type: string
    user_id: string
    exercise_name: string
}

interface Exercise {
    id: number,
    exercise_name: string,
    workout_id: string
}


interface Sets {
    id: string,
    exercise_id: number,
    exercise_reps: number,
    workout_id: number,
    exercise_weight: number,
    set_type: string
}



const WorkoutScreen = ({ showWorkout, setShowWorkout, workoutId, setActiveWorkout, workoutName }: WorkoutScreenProps) => {


    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseSets, setExerciseSets] = useState<Sets[]>([]);
    const [refresh, setRefresh] = useState(0);
    const [toggleAddExercise, setToggleAddExercise] = useState(false);
    const [toggleReplaceExercise, setToggleReplaceExercise] = useState(false)
    const [showTimerPopup, setShowTimerPopup] = useState(false);
    const [exerciseToReplace, setExerciseToReplace] = useState<string>('');
    const [previousSetsMap, setPreviousSetsMap] = useState<Record<string, HistorySet[]>>({});
    const [showCompletedScreen, setShowCompletedScreen] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [completedTime, setCompletedTime] = useState<number>(0);

    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [historyExercise, setHistoryExercise] = useState<string>("");


    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();


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
    }, [refresh]);


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
    }, [refresh]);


    useEffect(() => {
        const fetchAllPreviousSets = async () => {
            const newPreviousSetsMap: Record<string, HistorySet[]> = {};

            for (const exercise of exercises) {
                try {
                    const previousSetsData = await axiosPrivate.get(`${PREVIOUS_SETS_URL}/${exercise.exercise_name}`);
                    newPreviousSetsMap[exercise.exercise_name] = previousSetsData.data.previousSets;
                } catch (error) {
                    console.error(`Error fetching previous sets for ${exercise.exercise_name}:`, error);
                    newPreviousSetsMap[exercise.exercise_name] = [];
                }
            }

            setPreviousSetsMap(newPreviousSetsMap);
        };

        if (exercises.length > 0) {
            fetchAllPreviousSets();
        }
    }, [exercises]);

    useEffect(() => {
        let intervalId: number;

        if (!showCompletedScreen) {
            intervalId = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000) as unknown as number;
        }


        return () => {
            clearInterval(intervalId);
            setElapsedTime(0);
        }

    }, [setShowCompletedScreen])

    const handleAddSet = (item: Exercise) => {
        let setID = uuid.v4();

        setExerciseSets([...exerciseSets, {
            id: setID,
            exercise_id: item.id,
            exercise_reps: 0,
            workout_id: workoutId,
            exercise_weight: 0,
            set_type: "default"
        }])
    }

    const handleRemoveSet = (id: String) => {
        const updatedSets = exerciseSets.filter(set => set.id !== String(id));
        setExerciseSets(updatedSets);
    }

    const handleSetTypeChange = (id: string, type: string) => {
        setExerciseSets(prevSets => prevSets.map(s =>
            s.id === id ? { ...s, set_type: type } : s))
    }


    const handleSave = async () => {

        //Check if there are any null values
        const nullSets = exerciseSets.filter(set => (set.exercise_reps === 0 || set.exercise_weight === 0));
        if (nullSets.length > 0) {
            Alert.alert("Empty Sets", "One or more sets have missing values");
            return;
        }

        try {
            const response = await axiosPrivate.patch(SETS_URL, {
                exerciseSets,
                workoutId,
                exercises,
                workoutName,
                save: false,
                userId: auth.userId,
                elapsedTime

            });

            console.log(response)
            setActiveWorkout(0);
            setCompletedTime(elapsedTime);
            setElapsedTime(0);
            setShowCompletedScreen(true)
        } catch (error: any) {
            console.error(error.message)
        }

    }

    const handleDeleteExercise = async (exerciseId: number) => {

        try {
            const response = await axiosPrivate.delete(EXERCISES_URL + `/delete/${exerciseId}`);

            if (response.status === 200 && response.data.message === 'exercise deleted!') {
                const updatedSets = exerciseSets.filter(set => set.exercise_id !== exerciseId);
                const updatedExercises = exercises.filter(exercise => exercise.id !== exerciseId);
                setExerciseSets(updatedSets);
                setExercises(updatedExercises);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancelWorkout = () => {
        Alert.alert("Canceling Workout", "Are you sure you want to cancel your workout?", [
            {
                text: "Ok",
                onPress: () => {
                    setShowWorkout(false)
                    setActiveWorkout(0)
                }
            },
            {
                text: "Cancel",
                onPress: () => {
                }
            }
        ])
    }


    const handleRepChange = (set: Sets, reps: number) => {
        setExerciseSets(prevSets => prevSets.map(s =>
            s.id === set.id ? { ...s, exercise_reps: reps } : s))
    }

    const handleWeightChange = (set: Sets, weight: number) => {
        setExerciseSets(prevSets => prevSets.map(s => (
            s.id === set.id ? { ...s, exercise_weight: weight } : s
        )))
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    const renderItem = (item: Exercise) => {
        // Filter sets for this specific exercise
        const exerciseSetsFiltered = exerciseSets.filter(set => set.exercise_id === item.id);

        // Get previous sets for this exercise from the map
        const previousSets = previousSetsMap[item.exercise_name] || [];

        // Sort sets so that ones with the highest weight appear first
        const sortedSets = previousSets.sort(
            (a,b) => a.exercise_weight - b.exercise_weight
        )

        return (
            <View className='px-5 py-5 mb-4 bg-surface rounded-3xl border-2 border-accent/20 shadow-lg'>
                {/* Header */}
                <View className='flex flex-row items-center mb-5 pb-4 border-b border-gray-700/50'>
                    <View className='bg-accent/10 rounded-full p-3 mr-3'>
                        <MaterialCommunityIcons name="dumbbell" size={24} color="#6366F1" />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-white font-pextrabold text-xl mb-1'>{item.exercise_name}</Text>
                        <View className='flex-row items-center'>
                            <MaterialCommunityIcons name="counter" size={14} color="#9CA3AF" />
                            <Text className='text-gray-400 font-pmedium text-sm ml-1'>
                                {exerciseSetsFiltered.length} {exerciseSetsFiltered.length === 1 ? 'set' : 'sets'}
                            </Text>
                        </View>
                    </View>
                    <Menu>
                        <MenuTrigger>
                            <View className="bg-accent/10 p-3 rounded-xl border border-accent/30">
                                <AntDesign name="ellipsis" size={20} color="#6366F1" />
                            </View>
                        </MenuTrigger>
                        <MenuOptions
                            optionsContainerStyle={{
                                backgroundColor: '#252D3F',
                                borderRadius: 16,
                                marginTop: 40,
                                borderWidth: 1,
                                borderColor: '#6366F1',
                            }}
                        >
                            <MenuOption
                                style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
                                onSelect={() => {
                                    handleDeleteExercise(item.id)
                                }}
                            >
                                <MaterialCommunityIcons name="delete-outline" size={22} color="#EF4444" />
                                <Text className="text-white text-base font-pmedium ml-3">Remove Exercise</Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => {
                                    setToggleReplaceExercise(true)
                                    setExerciseToReplace(item.exercise_name)
                                }}
                                style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
                            >
                                <MaterialCommunityIcons name="swap-horizontal" size={22} color="#6366F1" />
                                <Text className="text-white text-base font-pmedium ml-3">Replace Exercise</Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => {
                                    setShowHistory(true)
                                    setHistoryExercise(item.exercise_name)
                                }}
                                style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
                            >
                                <MaterialCommunityIcons name="history" size={22} color="#6366F1" />
                                <Text className="text-white text-base font-pmedium ml-3">History</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>

                {/* Sets List */}
                <View className='space-y-2'>
                    {exerciseSetsFiltered.map((set, index) => (
                        <RenderSet
                            key={set.id}
                            set={set}
                            index={index}
                            handleRemoveSet={handleRemoveSet}
                            handleRepChange={handleRepChange}
                            handleWeightChange={handleWeightChange}
                            handleSetTypeChange={handleSetTypeChange}
                            prevSet={sortedSets[index] || {}}
                        />
                    ))}

                    {/* Add Set Button */}
                    <TouchableOpacity
                        className='mt-3 bg-accent/10 py-3.5 rounded-xl active:bg-accent/20 border-2 border-accent/30 flex-row items-center justify-center'
                        onPress={() => { handleAddSet(item) }}
                    >
                        <MaterialCommunityIcons name="plus-circle" size={20} color="#6366F1" />
                        <Text className='text-accent text-center font-pbold text-base ml-2'>Add Set</Text>
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
                <StatusBar barStyle='light-content' backgroundColor='#0A0E1A' />
                <MenuProvider skipInstanceCheck={true}>
                    <FlatList
                        data={exercises}
                        renderItem={({ item }) => renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={() => (
                            <View className='px-5 pt-6 pb-4'>
                                {/* Top Actions */}
                                <View className="flex flex-row justify-between items-center mb-6">
                                    <TouchableOpacity
                                        className='bg-surface border-2 border-gray-700 p-3 rounded-xl active:bg-gray-800'
                                        onPress={() => {
                                            setShowTimerPopup(true)
                                        }}
                                    >
                                        <MaterialCommunityIcons name="timer-outline" size={24} color="#9CA3AF" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className='bg-success px-6 py-3.5 rounded-xl shadow-lg shadow-success/40 active:scale-95 flex-row items-center'
                                        onPress={() => {
                                            Alert.alert("Finishing Workout", "Are you sure you want to finish your workout?", [
                                                {
                                                    text: "Ok",
                                                    onPress: () => {
                                                        handleSave()
                                                        setActiveWorkout(0)
                                                    }
                                                },
                                                {
                                                    text: "Cancel",
                                                    onPress: () => {
                                                    }
                                                }
                                            ])
                                        }}
                                    >
                                        <MaterialCommunityIcons name="check-circle" size={20} color="white" />
                                        <Text className='text-white font-pbold text-base ml-2'>Finish Workout</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Workout Info Card */}
                                <View className='bg-surface rounded-3xl p-6 mb-6 border-2 border-accent/30 shadow-xl'>
                                    <View className='flex-row items-center mb-4'>
                                        <View className='bg-accent/20 rounded-full p-2.5 mr-3'>
                                            <MaterialCommunityIcons name="weight-lifter" size={28} color="#6366F1" />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='text-gray-400 font-pmedium text-sm mb-1'>Active Workout</Text>
                                            <Text className='text-white font-pextrabold text-2xl'>{workoutName}</Text>
                                        </View>
                                    </View>

                                    {/* Timer Display */}
                                    <View className='bg-primary-light/80 rounded-2xl px-5 py-4 border border-accent/20'>
                                        <View className='flex-row items-center justify-between'>
                                            <View className='flex-row items-center'>
                                                <View className='bg-accent/20 rounded-full p-2 mr-3'>
                                                    <MaterialCommunityIcons name="clock-outline" size={20} color="#6366F1" />
                                                </View>
                                                <View>
                                                    <Text className='text-gray-400 text-xs font-pmedium mb-1'>Duration</Text>
                                                    <Text className='text-white font-pbold text-2xl'>{formatTime(elapsedTime)}</Text>
                                                </View>
                                            </View>
                                            <View className='bg-accent/10 rounded-full px-3 py-1'>
                                                <Text className='text-accent font-pbold text-xs'>LIVE</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Section Header */}
                                <View className='flex-row items-center justify-between mb-4'>
                                    <Text className='text-white font-pbold text-xl'>Exercises</Text>
                                    <View className='bg-accent/10 rounded-full px-3 py-1'>
                                        <Text className='text-accent font-pbold text-xs'>{exercises.length} total</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View className='flex gap-4 items-center px-5 py-6'>
                                <TouchableOpacity
                                    className="bg-accent/10 border-2 border-accent/30 rounded-2xl w-full py-4 active:bg-accent/20 flex-row items-center justify-center"
                                    onPress={() => {
                                        setToggleAddExercise(prev => !prev)
                                    }}
                                >
                                    <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#6366F1" />
                                    <Text className="text-accent font-pbold text-lg ml-2">Add Exercise</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-error/10 border-2 border-error/30 rounded-2xl w-full py-4 active:bg-error/20 flex-row items-center justify-center"
                                    onPress={handleCancelWorkout}
                                >
                                    <MaterialCommunityIcons name="close-circle-outline" size={22} color="#EF4444" />
                                    <Text className="text-error font-pbold text-lg ml-2">Cancel Workout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </MenuProvider>
                {
                    showTimerPopup
                }
                {
                    (toggleAddExercise || toggleReplaceExercise) && (

                        <ExerciseListPopup
                            toggleAddExercise={toggleAddExercise}
                            setToggleAddExercise={setToggleAddExercise}
                            workoutExercises={exercises}
                            setWorkoutExercises={setExercises}
                            toggleReplaceExercise={toggleReplaceExercise}
                            setToggleReplaceExercise={setToggleReplaceExercise}
                            workoutId={workoutId}
                            exerciseToReplace={exerciseToReplace ?? ''}
                            refresh={refresh}
                            setRefresh={setRefresh}
                        />
                    )
                }
                {
                    showCompletedScreen && completedTime != 0 && (
                        <CompletedWorkout
                            workoutName={workoutName}
                            workoutTimer={completedTime}
                            exercises={exercises}
                            sets={exerciseSets}
                            showWorkout={showWorkout}
                            setShowWorkout={setShowWorkout}
                        />
                    )
                }
                {
                    showHistory && (
                        <ExerciseHistory
                            visible={showHistory}
                            exerciseName={historyExercise}
                            onClose={() => setShowHistory(false)}
                        />
                    )
                }
            </SafeAreaView>
        </Modal>
    )
}

export default WorkoutScreen

