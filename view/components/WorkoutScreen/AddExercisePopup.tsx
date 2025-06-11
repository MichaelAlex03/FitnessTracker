import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import fetchExercises from '@/hooks/fetchExercises';
import Modal from 'react-native-modal';


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
}



const AddExercisePopup = ({ addExercise, setAddExercise, workoutExercises, setWorkoutExercises }: AddExerciseProps) => {

    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([] as Exercise[])

    const { exercises } = fetchExercises();
    const [filteredExercises, setFilteredExercises] = useState<ExerciseList[]>([] as ExerciseList[]);
    const [searchData, setSearchData] = useState('');


    const handleAddExercise = (item: Exercise) => {
        setWorkoutExercises([...workoutExercises, item])
    }

    useEffect(() => {
        if (searchData.trim() === ''){
            setFilteredExercises(exercises)
        }


    }, [searchData])

    return (
        <Modal
            isVisible={addExercise}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackdropPress={() => setAddExercise(false)}
        >
            <View className='bg-red flex-1 justify-center items-center p-6'>
                <View className='bg-primary w-full h-3/4 rounded-2xl items-center'>
                    <View className='flex flex-row justify-between items-center w-full p-6'>
                        <TouchableOpacity className='bg-secondary py-2 px-3 rounded-lg' onPress={() => setAddExercise(false)}>
                            <Text className='text-white'>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={selectedExercises.length < 1}
                        >
                            <View className='flex flex-row gap-2'>
                                <Text className={selectedExercises.length > 1 ? 'text-white' : 'text-gray-500'}>Add</Text>
                                {
                                    selectedExercises.length > 0 && <Text className='text-white'>({selectedExercises.length})</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default AddExercisePopup;