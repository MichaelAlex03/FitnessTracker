import { Text, View, FlatList, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenamePopup from '@/components/RenamePopup';
import RenderSet from '@/components/WorkoutScreen/RenderSet';
import ExerciseListPopup from '@/components/WorkoutScreen/ExerciseListPopup';
import uuid from 'react-native-uuid';


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


const EditWorkout = ({ showWorkout, setShowWorkout, workoutId, setActiveWorkout, workoutName }: WorkoutScreenProps) => {


    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseSets, setExerciseSets] = useState<Sets[]>([]);
    const [editWorkoutName, setEditWorkoutName] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [toggleAddExercise, setToggleAddExercise] = useState(false);
    const [toggleReplaceExercise, setToggleReplaceExercise] = useState(false)
    const [showTimerPopup, setShowTimerPopup] = useState(false);
    const [exerciseToReplace, setExerciseToReplace] = useState<string>('');


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
            });

            console.log(response)

            Alert.alert("Finished Workout", "Your workout is complete!");
            setActiveWorkout(0);
            setShowWorkout(false);
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

    console.log("SETS", exerciseSets)

    const handleRepChange = (set: Sets, reps: number) => {
        setExerciseSets(prevSets => prevSets.map(s =>
            s.id === set.id ? { ...s, exercise_reps: reps } : s))
    }

    const handleWeightChange = (set: Sets, weight: number) => {
        setExerciseSets(prevSets => prevSets.map(s => (
            s.id === set.id ? { ...s, exercise_weight: weight } : s
        )))
    }


    const renderItem = (item: Exercise) => {
        // Filter sets for this specific exercise
        const exerciseSetsFiltered = exerciseSets.filter(set => set.exercise_id === item.id);


        return (
            <View className='p-4'>
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
                                    setToggleReplaceExercise(true)
                                    setExerciseToReplace(item.exercise_name)
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
                        <RenderSet
                            key={set.id}
                            set={set}
                            index={index}
                            handleRemoveSet={handleRemoveSet}
                            handleRepChange={handleRepChange}
                            handleWeightChange={handleWeightChange}
                        />
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
                                            setShowTimerPopup(true)
                                        }}
                                    >
                                        <Icon name="access-time" size={20} color="#000000" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className='bg-secondary px-4 py-2 rounded-lg'
                                        onPress={() => {
                                            handleSave()
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

                                   
                                </View>
                            </View>
                        )}
                        ListFooterComponent={() => (
                            <View className='flex gap-8 items-center p-6'>
                                <TouchableOpacity
                                    className="bg-gray-600 rounded-xl w-full p-3 "
                                    onPress={() => {
                                        setToggleAddExercise(prev => !prev)
                                    }}
                                >
                                    <Text className="text-white font-bold text-center">Add Exercise</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-red-400/20 rounded-xl w-full p-3"
                                    onPress={handleCancelWorkout}>
                                    <Text className="text-red-400 font-bold text-center">Cancel Workout</Text>
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
                        />
                    )
                }
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

            </SafeAreaView>

        </Modal>
    )
}

export default EditWorkout

