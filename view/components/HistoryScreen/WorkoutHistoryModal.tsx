import { Text, View, Modal, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Set {
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
    id: number
    exercise_name: string
    workout_id: number
    user_id: string
}

interface Workout {
    id: number
    created_at: Date
    workout_name: string
    user_id: string
    time_elapsed: number
}

interface ModalHistoryProps {
    sets: Set[]
    exercises: Exercise[]
    workout: Workout
    showWorkoutHistory: boolean
    setShowWorkoutHistory: (val: boolean) => void
}

const WorkoutHistoryModal = ({ workout, exercises, sets, showWorkoutHistory, setShowWorkoutHistory }: ModalHistoryProps) => {

    const dateOfWorkout = workout.created_at;
    const totalWeight = sets.reduce((sum, set) => sum + set.exercise_weight, 0);

    const formatTime = () => {
        const minutes = Math.floor(workout.time_elapsed / 60);
        const remainingSeconds = workout.time_elapsed % 60;

        return minutes > 0 ? `${minutes.toString()}m` : `${remainingSeconds.toString()}s`
    }

    return (
        <Modal
            visible={true}
            animationType='slide'
            transparent={true}
            onRequestClose={() => { setShowWorkoutHistory(false) }}
        >
            <View className='flex-1 justify-center items-center bg-black/40'>
                <View className='bg-primary w-11/12 p-6 rounded-2xl'>
                    <View className='flex-row justify-between items-center'>
                        <Text className='text-white font-bold text-lg'>{workout.workout_name}</Text>
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
                                    onSelect={() => { }}
                                    style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <AntDesign name="delete" size={20} color="red" className='mr-2' />
                                    <Text className="text-white text-base">Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>

                    <Text className='text-white font-semibold text-md'>
                        {dateOfWorkout ? new Date(dateOfWorkout).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }) : ''}
                    </Text>

                    <View className='flex flex-row justify-start gap-4 items-center mt-5'>
                        <View className='flex flex-row items-center'>
                            <AntDesign name="clockcircleo" size={20} color="white" className='mr-2' />
                            <Text className='text-white'>{formatTime()}</Text>
                        </View>

                        <View className='flex flex-row items-center'>
                            <MaterialCommunityIcons name="dumbbell" size={20} color="white" className='mr-2' />
                            <Text className='text-white'>{totalWeight}lb</Text>
                        </View>

                        
                    </View>

                    <View className='flex mt-5'>
                        {exercises.map((exercise, index) => {
                            // Filter sets for this exercise
                            const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);

                            return (
                                <View className='mb-2' key={exercise.id}>
                                    <View className='flex flex-row'>
                                        <View className='flex-1'>
                                            <View className='flex flex-row justify-between'>
                                                <Text className='text-white font-bold text-xl'>{exercise.exercise_name}</Text>
                                            </View>
                                            {exerciseSets.map((set) => {
                                                return (
                                                    <View className='flex flex-row justify-between' key={set.id}>
                                                        <Text className='text-white text-lg font-base mt-1'>
                                                            {set.exercise_weight} lb x {set.exercise_reps} reps
                                                        </Text>

                                                       
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}

                        <View className='items-center w-full'>
                            <TouchableOpacity className='w-3/4 rounded-2xl bg-secondary p-3 mt-5' onPress={() => setShowWorkoutHistory(false)}>
                                <Text className='text-white text-center'>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default WorkoutHistoryModal
