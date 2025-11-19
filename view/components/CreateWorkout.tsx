import { Text, View, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';


const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';

interface UserExercise {
    exercise_name: string,
}

interface ExerciseList {
    exercise_name: string,
    exercise_category: string,
    exercise_instructions: string,
    id: string
}


interface CreateWorkoutProps {
    showCreateWorkout: boolean,
    setShowCreateWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    exercises: ExerciseList[],
    setRefresh: React.Dispatch<React.SetStateAction<number>>
    refresh: number
}

const CreateWorkout = ({ showCreateWorkout, setShowCreateWorkout, exercises, setRefresh, refresh }: CreateWorkoutProps) => {
    const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<UserExercise>({} as UserExercise);
    const [workoutName, setWorkoutName] = useState('');

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const exerciseNames = exercises.map((ex, i) => ({
        exercise_name: ex.exercise_name,
        value: i.toString()
    }));

    const handleCreateWorkout = async () => {

        if (selectedExercises.length == 0) {
            Alert.alert("No Workouts Selected", "Please select at least one exercise to create a workout");
            return;
        }

        if (!workoutName) {
            Alert.alert("No Workout Name", "Please enter in a workout name");
            return;
        }

        try {
            const response = await axiosPrivate.post(WORKOUT_URL, {
                userId: auth.userId,
                workoutName,
            })

            const workoutId = response.data.workoutId;

            await axiosPrivate.post(EXERCISES_URL, {
                workoutId,
                selectedExercises
            })

            setRefresh(refresh + 1);
            setShowCreateWorkout(false);
        } catch (err) {
            console.error(err)
        }
    }


    //Exercise item for the selected exercises list
    const exerciseItem = (name: string, id: number) => {
        return (
            <View key={id} className='bg-primary-light rounded-2xl p-4 border-2 border-accent/20 w-full flex flex-row justify-between items-center'>
                <View className='flex-row items-center flex-1'>
                    <View className='bg-accent/20 rounded-full p-2 mr-3'>
                        <AntDesign name="check" size={16} color="#6366F1" />
                    </View>
                    <Text className='text-white font-pmedium text-base flex-1'>{name}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => handleRemoveExercise(name)}
                    className='bg-error/20 p-2 rounded-lg'
                >
                    <AntDesign name="delete" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        )
    }

    const handleAddExercise = (item: UserExercise) => {
        const found = selectedExercises.find(exercise => exercise.exercise_name === item.exercise_name);
        if (found) {
            Alert.alert("Duplicate Exercise", "You have already added this exercise to the workout");
            return;
        }
        setSelectedExercises([...selectedExercises, item]);
        setSelectedExercise(item);
    }

    const handleRemoveExercise = (name: string) => {
        const updatedExercises = selectedExercises.filter((exercise) => exercise.exercise_name !== name);
        setSelectedExercises(updatedExercises);
    }

    console.log(selectedExercises)

    return (
        <Modal
            visible={showCreateWorkout}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCreateWorkout(false)}
        >
            <View className="flex-1 bg-black/80 justify-end">
                <View className='bg-surface rounded-t-3xl border-t-2 border-accent/30 max-h-[90%]'>
                    {/* Handle Bar */}
                    <View className="items-center py-3">
                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                    </View>

                    <View className='px-6 pb-6'>
                        {/* Header */}
                        <View className='mb-6'>
                            <Text className='text-white text-3xl font-pextrabold mb-2'>Create Workout</Text>
                            <Text className='text-gray-400 text-base font-pmedium'>Build your custom training routine</Text>
                        </View>

                        <Text className='text-sm text-gray-300 font-pmedium mb-2'>Workout Name</Text>
                        <View className='border-2 border-gray-700 w-full h-14 px-4 bg-primary-light rounded-2xl flex flex-row items-center mb-6'>
                            <TextInput
                                value={workoutName}
                                onChangeText={(e) => setWorkoutName(e)}
                                placeholder="Enter workout name"
                                placeholderTextColor="#6B7280"
                                className="text-white w-full font-pmedium text-base"
                            />
                        </View>

                    {/* Selected Exercises List */}
                    {selectedExercises.length > 0 && (
                        <View className='mb-6'>
                            <Text className='text-sm text-gray-300 font-pmedium mb-3'>
                                Selected Exercises ({selectedExercises.length})
                            </Text>
                            <View className='flex gap-3'>
                                {selectedExercises.map((exercise, i) => {
                                    return exerciseItem(exercise.exercise_name, i)
                                })}
                            </View>
                        </View>
                    )}

                    <Text className='text-sm text-gray-300 font-pmedium mb-2'>Add Exercise</Text>
                    <View className='w-full mb-6'>
                        <Dropdown
                            data={exerciseNames}
                            value={selectedExercise}
                            maxHeight={300}
                            placeholder='Select an exercise to add'
                            labelField="exercise_name"
                            valueField="value"
                            onChange={(item) => {
                                handleAddExercise(item)
                            }}
                            style={{
                                backgroundColor: '#141925',
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                paddingVertical: 14,
                                borderWidth: 2,
                                borderColor: '#374151',
                                height: 56,
                            }}
                            containerStyle={{
                                backgroundColor: '#252D3F',
                                borderRadius: 16,
                                borderWidth: 2,
                                borderColor: '#6366F1',
                                marginTop: 8,
                                shadowColor: '#6366F1',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                            }}
                            placeholderStyle={{
                                color: '#6B7280',
                                fontSize: 16,
                                fontWeight: '500',
                            }}
                            selectedTextStyle={{
                                color: '#E5E7EB',
                                fontSize: 16,
                                fontWeight: '600',
                            }}
                            itemTextStyle={{
                                color: '#E5E7EB',
                                fontSize: 16,
                                fontWeight: '500',
                            }}
                            itemContainerStyle={{
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                borderRadius: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: '#374151',
                            }}
                            activeColor="#1E2433"
                            iconStyle={{
                                width: 20,
                                height: 20,
                                tintColor: '#6366F1',
                            }}
                        />
                    </View>

                    <View className='flex gap-4 mt-8'>
                        <TouchableOpacity
                            onPress={handleCreateWorkout}
                            className='bg-accent rounded-2xl py-4 shadow-lg shadow-accent/40 active:scale-95'
                        >
                            <Text className='text-white text-center font-pbold text-lg'>Create Workout</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowCreateWorkout(false)}
                            className='bg-gray-700 py-4 rounded-2xl active:bg-gray-600'
                        >
                            <Text className='text-white text-center font-pbold text-lg'>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
};


export default CreateWorkout
