import { Text, View, FlatList, Modal, TextInput, Alert, StatusBar } from 'react-native'
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
import useAuth from '@/hooks/useAuth';


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
    const [previousSetsMap, setPreviousSetsMap] = useState<Record<string, HistorySet[]>>({});


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
                save: false,
                userId: auth.userId
            });

            console.log(response)

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
             (a,b) => a.exercise_weight - b.exercise_weight
         )
 


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
                                onSelect={() => handleDeleteExercise(item.id)}
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
                            handleSetTypeChange={handleSetTypeChange}
                            editWorkout={true}
                            prevSet={sortedSets[index] || {}}
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
            visible={editWorkout}
            animationType="slide"
            onRequestClose={() => {
                setEditWorkout(false)
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
                            <View className='px-6 py-6 gap-4 mt-16'>
                                <View className="flex flex-row justify-evenly items-center">
                                    <TouchableOpacity
                                        className='bg-gray-400 px-6 py-2 rounded-lg mr-auto'
                                        onPress={() => {
                                            setEditWorkout(false)
                                            setActiveWorkout(0)
                                        }}
                                    >
                                        <Text className='text-white'>Back</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className='bg-secondary px-4 py-2 rounded-lg'
                                        onPress={() => {
                                            handleSave()
                                            setActiveWorkout(0)

                                        }}
                                    >
                                        <Text className=' text-white'>Save</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='flex flex-col gap-2 mt-10'>
                                    <View className='flex flex-row items-center gap-4'>
                                        <TextInput className='text-white font-bold text-2xl' editable={false}>{currentWorkoutName}</TextInput>
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
                            currentWorkoutName={currentWorkoutName}
                            setCurrentWorkoutName={setCurrentWorkoutName}
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
                <StatusBar />
            </SafeAreaView>

        </Modal>
    )
}

export default EditWorkout

