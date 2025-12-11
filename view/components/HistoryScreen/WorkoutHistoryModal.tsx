import { Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
            <SafeAreaView className='flex-1 justify-end bg-black/50' edges={['top', 'left', 'right']}>
                <View className='bg-primary rounded-t-3xl max-h-[90%]'>
                    <View className='border-b border-gray-700 px-6 py-4'>
                        <View className='flex-row justify-between items-center mb-3'>
                            <View className='flex-1'>
                                <Text className='text-gray-400 font-pmedium text-sm mb-1'>Workout Summary</Text>
                                <Text className='text-white font-pextrabold text-2xl'>{workout.workout_name}</Text>
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
                                        onSelect={() => { }}
                                        style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
                                    >
                                        <AntDesign name="delete" size={20} color="#EF4444" />
                                        <Text className="text-white text-base font-pmedium ml-3">Delete</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>

                        <View className='flex-row items-center'>
                            <MaterialCommunityIcons name="calendar-clock" size={16} color="#9CA3AF" />
                            <Text className='text-gray-400 font-pmedium text-sm ml-2'>
                                {dateOfWorkout ? new Date(dateOfWorkout).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) : ''}
                            </Text>
                        </View>
                    </View>

                    <View className='flex-row gap-3 px-6 py-4'>
                        <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
                            <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                                <MaterialCommunityIcons name="clock-outline" size={20} color="#6366F1" />
                            </View>
                            <Text className='text-accent font-pbold text-xl'>{formatTime()}</Text>
                            <Text className='text-accent/70 font-pmedium text-xs'>Duration</Text>
                        </View>

                        <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
                            <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                                <MaterialCommunityIcons name="weight-lifter" size={20} color="#6366F1" />
                            </View>
                            <Text className='text-accent font-pbold text-xl'>{totalWeight}</Text>
                            <Text className='text-accent/70 font-pmedium text-xs'>Total Volume (lbs)</Text>
                        </View>

                        <View className='flex-1 bg-surface border-2 border-accent/20 rounded-2xl p-4'>
                            <View className='bg-accent/20 rounded-full p-2 w-10 h-10 items-center justify-center mb-2'>
                                <MaterialCommunityIcons name="format-list-numbered" size={20} color="#6366F1" />
                            </View>
                            <Text className='text-accent font-pbold text-xl'>{exercises.length}</Text>
                            <Text className='text-accent/70 font-pmedium text-xs'>Exercises</Text>
                        </View>
                    </View>

                 
                    <ScrollView className='px-6 pb-4' showsVerticalScrollIndicator={false}>
                        <Text className='text-white font-pbold text-lg mb-3'>Exercise Details</Text>

                        {exercises.map((exercise) => {
                            const exerciseSets = sets.filter(set => set.exercise_id === exercise.id);
                            const exerciseVolume = exerciseSets.reduce((sum, set) =>
                                sum + (set.exercise_weight * set.exercise_reps), 0
                            );

                            return (
                                <View className='mb-4 bg-surface border-2 border-gray-700 rounded-2xl p-4' key={exercise.id}>
                                    <View className='flex-row items-center justify-between mb-3 pb-2 border-b border-gray-700'>
                                        <View className='flex-1'>
                                            <Text className='text-white font-pbold text-lg'>{exercise.exercise_name}</Text>
                                            <Text className='text-gray-400 font-pmedium text-xs mt-1'>
                                                {exerciseSets.length} {exerciseSets.length === 1 ? 'set' : 'sets'} • {exerciseVolume} lbs volume
                                            </Text>
                                        </View>
                                    </View>

                                    <View className='gap-2'>
                                        {exerciseSets.map((set, setIndex) => {
                                            const getSetTypeStyle = () => {
                                                switch(set.set_type.toLowerCase()) {
                                                    case 'warmup':
                                                        return { bg: 'bg-blue-500/20', text: 'text-blue-400' };
                                                    case 'drop':
                                                        return { bg: 'bg-purple-500/20', text: 'text-purple-400' };
                                                    case 'failure':
                                                        return { bg: 'bg-red-500/20', text: 'text-red-400' };
                                                    default:
                                                        return { bg: 'bg-accent/20', text: 'text-accent' };
                                                }
                                            };

                                            const setStyle = getSetTypeStyle();

                                            return (
                                                <View className='flex-row items-center justify-between bg-primary-light/50 rounded-xl p-3' key={set.id}>
                                                    <View className='flex-row items-center flex-1'>
                                                        <View className={`${setStyle.bg} w-8 h-8 rounded-lg items-center justify-center mr-3`}>
                                                            <Text className={`${setStyle.text} font-pbold text-sm`}>
                                                                {setIndex + 1}
                                                            </Text>
                                                        </View>

                                                        <View className='flex-row items-center'>
                                                            <Text className='text-white font-pbold text-base'>
                                                                {set.exercise_weight}
                                                            </Text>
                                                            <Text className='text-gray-400 font-pmedium text-sm mx-1'>
                                                                lbs ×
                                                            </Text>
                                                            <Text className='text-white font-pbold text-base'>
                                                                {set.exercise_reps}
                                                            </Text>
                                                            <Text className='text-gray-400 font-pmedium text-sm ml-1'>
                                                                reps
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    {set.set_type.toLowerCase() !== 'default' && (
                                                        <View className={`${setStyle.bg} px-2 py-1 rounded-md`}>
                                                            <Text className={`${setStyle.text} font-pmedium text-xs uppercase`}>
                                                                {set.set_type}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            );
                        })}

                        <TouchableOpacity
                            className='bg-accent rounded-2xl p-4 mt-2 mb-6 flex-row items-center justify-center shadow-lg'
                            onPress={() => setShowWorkoutHistory(false)}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                            <Text className='text-white font-pbold text-base ml-2'>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default WorkoutHistoryModal
