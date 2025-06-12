import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native'
import fetchExercises from '@/hooks/fetchExercises';
import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';



//Interface used for the exercise that are in their workout not list that they can choose from
interface Exercise {
    id: number,
    exercise_name: string,
    workout_id: string
}

//Interface used for set of exercises that users can choose from not the exercises in their workout
interface ExerciseList {
    exercise_name: string,
    exercise_category: string,
    exercise_instructions: string,
    id: string
}

interface AddExerciseProps {
    addExercise: boolean
    setAddExercise: (val: boolean) => void
    workoutExercises: Exercise[],
    setWorkoutExercises: (val: Exercise[]) => void
    workoutId: Number
}

interface ExerciseItem {
    item: ExerciseList
}


const AddExercisePopup = ({ addExercise, setAddExercise, workoutExercises, setWorkoutExercises }: AddExerciseProps) => {

    console.log(workoutExercises)

    const [selectedExercises, setSelectedExercises] = useState<string[]>([])

    const { exercises } = fetchExercises();
    const [filteredExercises, setFilteredExercises] = useState<ExerciseList[]>([] as ExerciseList[]);
    const [searchData, setSearchData] = useState('');
    const [currentExercises, setCurrentExercises] = useState<string[]>([]);
    const [showExerciseInfo, setShowExerciseInfo] = useState(false);


    useEffect(() => {
        const names = workoutExercises.map((exercise) => exercise.exercise_name);
        setCurrentExercises(names);
    }, [])


    const handleAddExercise = (exerciseName: string) => {

        if (selectedExercises.includes(exerciseName)) {
            const updatedExercises = selectedExercises.filter((name) =>
                exerciseName != name
            );
            setSelectedExercises(updatedExercises);
        } else if (currentExercises.includes(exerciseName)) {
            Alert.alert("Duplicate Exercise", "This exercise already is in your current workout");
        } else {
            setSelectedExercises([...selectedExercises, exerciseName])
        }
    }

    const addSelectedExercisesToWorkout = async () => {

    }

    console.log(selectedExercises)


    useEffect(() => {
        if (searchData.trim() === '') {
            setFilteredExercises(exercises)
        }

        const filtered = exercises.filter((exercise) =>
            exercise.exercise_name.toLowerCase().startsWith(searchData.toLowerCase())
        )

        setFilteredExercises(filtered)


    }, [searchData, exercises])

    const renderExercise = ({ item }: ExerciseItem) => {
        return (
            <TouchableOpacity
                className={selectedExercises.includes(item.exercise_name)
                    ? "bg-secondary/20 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                    : "bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                }
                onPress={() => {
                    handleAddExercise(item.exercise_name)
                }}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-pmedium mb-1">
                            {item.exercise_name}
                        </Text>
                        <Text className="text-gray-100 text-sm">
                            {item.exercise_category}
                        </Text>
                    </View>

                    <View className="bg-secondary/20 p-2 rounded-xl">
                        {
                            selectedExercises.includes(item.exercise_name) ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#FF9C01"
                                />
                                :
                                <TouchableOpacity onPress={() => setShowExerciseInfo(true)}>
                                    <AntDesign
                                        name="question"
                                        size={20}
                                        color="#FF9C01"
                                    />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            isVisible={addExercise}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackdropPress={() => setAddExercise(false)}
        >
            <View className='bg-red flex-1 justify-center items-center'>
                <View className='bg-primary w-full h-3/4 rounded-2xl items-center'>
                    <View className='flex flex-row justify-between items-center w-full p-6'>
                        <TouchableOpacity className='bg-secondary py-2 px-3 rounded-lg' onPress={() => setAddExercise(false)}>
                            <Text className='text-white'>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={selectedExercises.length < 1}
                        >
                            <View className='flex flex-row gap-1'>
                                <Text className={selectedExercises.length > 0 ? 'text-white font-bold text-lg' : 'text-gray-500 text-lg'}>Add</Text>
                                {
                                    selectedExercises.length > 0 && <Text className='text-white font-bold text-lg'>({selectedExercises.length})</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-row w-full items-center justify-center px-6 mb-4'>
                        <AntDesign name="search1" size={24} color="white" />
                        <View className='border rounded-2xl border-black-200 h-12 flex justify-center px-4 flex-1 ml-6 '>
                            <TextInput
                                className='text-white'
                                value={searchData}
                                onChangeText={(val) => setSearchData(val)}
                            />
                        </View>
                    </View>

                    
                    <FlatList
                        data={filteredExercises}
                        renderItem={renderExercise}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default AddExercisePopup;