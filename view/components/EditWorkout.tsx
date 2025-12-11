import { Text, View, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenamePopup from '@/components/RenamePopup';
import RenderSet from '@/components/WorkoutScreen/RenderSet';
import ExerciseListPopup from '@/components/WorkoutScreen/ExerciseListPopup';
import uuid from 'react-native-uuid';
import useAuth from '@/hooks/useAuth';
import ExerciseHistory from './ExerciseHistory'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';


const EXERCISES_URL = '/api/exercises';
const SETS_URL = '/api/sets';
const PREVIOUS_SETS_URL = '/api/history/sets';

interface EditWorkoutProps {
    editWorkout: boolean,
    setEditWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number,
    setActiveWorkout: React.Dispatch<React.SetStateAction<number>>,
    refresh: number,
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
    workoutName: string
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


const EditWorkout = ({ editWorkout, setEditWorkout, workoutId, setActiveWorkout, refresh, setRefresh, workoutName }: EditWorkoutProps) => {


    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseSets, setExerciseSets] = useState<Sets[]>([]);
    const [editWorkoutName, setEditWorkoutName] = useState(false);
    const [toggleAddExercise, setToggleAddExercise] = useState(false);
    const [toggleReplaceExercise, setToggleReplaceExercise] = useState(false)
    const [exerciseToReplace, setExerciseToReplace] = useState<string>('');
    const [currentWorkoutName, setCurrentWorkoutName] = useState<string>(workoutName);
    const [newWorkoutName, setNewWorkoutName] = useState<string>(workoutName);
    const [previousSetsMap, setPreviousSetsMap] = useState<Record<string, HistorySet[]>>({});

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

    console.log("EXERCISES", exercises)

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

    //Retrieves previous sets for each exercise
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

    console.log("TEST", previousSetsMap)

    //Update refresh name in the edit workout screen after you change it in popup
    useEffect(() => {
        if (currentWorkoutName !== newWorkoutName) {
            setCurrentWorkoutName(newWorkoutName)
        }
    }, [refresh])


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


    const handleSave = async () => {

        try {
            const response = await axiosPrivate.patch(SETS_URL, {
                exerciseSets,
                workoutId,
                exercises,
                workoutName,
                save: true,
                userId: auth.userId
            });


            Alert.alert("Saved Workout", "Your workout is saved!");
            setActiveWorkout(0);
            setEditWorkout(false);
        } catch (error) {
            console.error(error)
        }

    }


    console.log("SETS", exerciseSets)

    const handleSetTypeChange = (id: string, type: string) => {
        setExerciseSets(prevSets => prevSets.map(s =>
            s.id === id ? { ...s, set_type: type } : s))
    }



    const renderItem = (item: Exercise) => {
        // Filter sets for this specific exercise
        const exerciseSetsFiltered = exerciseSets.filter(set => set.exercise_id === item.id);

        // Get previous sets for this exercise from the map
        const previousSets = previousSetsMap[item.exercise_name] || [];

        // Sort sets so that ones with the highest weight appear first
        const sortedSets = previousSets.sort(
            (a, b) => b.exercise_weight - a.exercise_weight
        )

        return (
            <View className='px-2 py-5 mb-4 bg-surface rounded-3xl border-2 border-accent/20 shadow-lg mx-4'>

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

                <View className='space-y-2'>
                    {exerciseSetsFiltered.map((set, index) => (
                        <RenderSet
                            key={set.id}
                            set={set}
                            index={index}
                            handleRemoveSet={handleRemoveSet}
                            handleSetTypeChange={handleSetTypeChange}
                            prevSet={sortedSets[index] || {}}
                        />
                    ))}


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
            visible={editWorkout}
            animationType="slide"
            onRequestClose={() => {
                setEditWorkout(false)
                setActiveWorkout(0)
            }}
        >
            <SafeAreaView className="flex-1 bg-primary" edges={['top', 'left', 'right']}>
                <MenuProvider skipInstanceCheck={true}>
                    <FlatList
                        data={exercises}
                        renderItem={({ item }) => renderItem(item)}
                        keyExtractor={(item) => item.id.toString()}
                        ListHeaderComponent={() => (
                            <View className='px-6 py-6 gap-4 mt-16'>
                                <View className="flex flex-row justify-between items-center">
                                    <TouchableOpacity
                                         className='bg-gray-400 px-6 py-3.5 rounded-xl shadow-lg shadow-success/40 active:scale-95 flex-row items-center justify-center'
                                        onPress={() => {
                                            setEditWorkout(false)
                                            setActiveWorkout(0)
                                        }}
                                    >
                                        <Text className='text-white'>Back</Text>
                                    </TouchableOpacity>

                                    
                                    <TouchableOpacity
                                        className='bg-success px-6 py-3.5 rounded-xl shadow-lg shadow-success/40 active:scale-95 flex-row items-center justify-center'
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
                                        <Text className='text-white font-pbold text-base ml-2'>Save Workout</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='flex flex-col gap-2 mt-10'>
                                    <View className='flex flex-row items-center gap-4'>
                                        <TextInput className='text-white font-bold text-2xl' editable={false}>{currentWorkoutName}</TextInput>
                                        <Menu>
                                            <MenuTrigger>
                                                <View className="bg-secondary/20 p-2 rounded-xl">
                                                    <AntDesign name="ellipsis" size={16} color="#6366F1" />
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
                                    onPress={() => {
                                        setEditWorkout(false)
                                    }}
                                >
                                    <MaterialCommunityIcons name="close-circle-outline" size={22} color="#EF4444" />
                                    <Text className="text-error font-pbold text-lg ml-2">Cancel Edit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </MenuProvider>
                {
                    editWorkoutName && (
                        <RenamePopup
                            showRename={editWorkoutName}
                            setShowRename={setEditWorkoutName}
                            workoutId={workoutId}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            currentWorkoutName={newWorkoutName}
                            setCurrentWorkoutName={setNewWorkoutName}
                        />
                    )
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

export default EditWorkout

