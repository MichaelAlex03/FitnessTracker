import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { FlatList } from 'react-native-gesture-handler'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

interface ExerciseHistoryProps {
    exerciseName: string
    visible: boolean
    onClose: () => void
}

interface PreviousSet {
    id: string
    exercise_id: number
    exercise_reps: number
    exercise_weight: number
    workout_id: number
    set_type: string
    user_id: string
    exercise_name: string
    created_at: Date
}

const HISTORY_DATA_URL = '/api/history'

const ExerciseHistory = ({ exerciseName, visible, onClose }: ExerciseHistoryProps) => {

    const axiosPrivate = useAxiosPrivate();
    const [groupedSets, setGroupedSets] = useState<Array<PreviousSet[]>>([]);


    const fetchPreviousSets = async () => {
        try {
            const previousSets = await axiosPrivate(`${HISTORY_DATA_URL}/sets/${exerciseName}`)
            groupSetsByWorkoutNumber(previousSets.data.previousSets)
        } catch (error) {
            console.error(error)
        }
    }

    const groupSetsByWorkoutNumber = (sets: PreviousSet[]) => {
        let setMap = new Map<number, PreviousSet[]>();

        sets.forEach(set => {

            const currentSets = setMap.get(set.workout_id)
            if (currentSets !== undefined) {
                currentSets.push(set);
                setMap.set(set.workout_id, currentSets);
            } else {
                const currentSets = []
                currentSets.push(set)
                setMap.set(set.workout_id, currentSets)
            }
        })

        let setByWorkoutNumber: Array<PreviousSet[]> = []
        setMap.forEach((value) => (
            setByWorkoutNumber.push(value)
        ))

        setGroupedSets(setByWorkoutNumber)
    }

    useEffect(() => {
        fetchPreviousSets()
    }, [])


    const renderSets = (item: PreviousSet[]) => {
        const sets = item;
        const workoutDate = new Date(item[0].created_at);

        const formattedDate = workoutDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const totalVolume = sets.reduce((sum, set) =>
            sum + (set.exercise_weight * set.exercise_reps), 0
        );

        return (
            <View className='mx-4 mb-4 bg-surface border-2 border-gray-700 rounded-2xl p-5'>
                <View className='flex-row items-center justify-between mb-4 pb-3 border-b border-gray-700'>
                    <View className='flex-row items-center'>
                        <View className='bg-accent/20 rounded-full p-2 mr-3'>
                            <MaterialCommunityIcons name="calendar" size={20} color="#6366F1" />
                        </View>
                        <View>
                            <Text className='text-white font-pbold text-base'>
                                {formattedDate}
                            </Text>
                            <Text className='text-gray-400 font-pmedium text-xs'>
                                {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                            </Text>
                        </View>
                    </View>

                    <View className='bg-accent/10 border border-accent/30 rounded-lg px-3 py-2'>
                        <Text className='text-accent font-pbold text-sm'>
                            {totalVolume.toLocaleString()} lbs
                        </Text>
                        <Text className='text-accent/70 font-pmedium text-xs'>
                            Volume
                        </Text>
                    </View>
                </View>

                <View className='gap-2'>
                    {sets.map((set, index) => {
                        const getSetTypeStyle = () => {
                            switch(set.set_type.toLowerCase()) {
                                case 'warmup':
                                    return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'fire' };
                                case 'drop':
                                    return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: 'arrow-down' };
                                case 'failure':
                                    return { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'alert-circle' };
                                default:
                                    return { bg: 'bg-accent/20', text: 'text-accent', icon: 'checkbox-marked-circle' };
                            }
                        };

                        const setStyle = getSetTypeStyle();

                        return (
                            <View
                                key={set.id}
                                className='flex-row items-center justify-between bg-primary-light/50 rounded-xl p-3'
                            >
                                <View className='flex-row items-center flex-1'>
                                    <View className={`${setStyle.bg} w-8 h-8 rounded-lg items-center justify-center mr-3`}>
                                        <Text className={`${setStyle.text} font-pbold text-sm`}>
                                            {index + 1}
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
        )
    }


    return (
        <Modal
            animationType='slide'
            visible={visible}
            onRequestClose={onClose}
            presentationStyle='fullScreen'
        >
            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'left', 'right']}>
                <View className='flex-1 px-4 pt-4 mt-10'>
                    <FlatList
                        data={groupedSets}
                        renderItem={({ item }) => renderSets(item)}
                        keyExtractor={(item) => item[0].id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListHeaderComponent={
                            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'left', 'right']}>
                                <View className='flex-row items-center justify-between mb-6'>
                                    <TouchableOpacity
                                        className='bg-surface border-2 border-gray-700 p-3 rounded-xl flex-row items-center'
                                        onPress={onClose}
                                    >
                                        <Ionicons name="arrow-back" size={20} color="#6366F1" />
                                        <Text className='text-accent font-pbold text-base ml-2'>Back</Text>
                                    </TouchableOpacity>
                                </View>

                                <View className='bg-surface border-2 border-accent/30 rounded-2xl p-5 mb-4'>
                                    <View className='flex-row items-center'>
                                        <View className='bg-accent/20 rounded-full p-3 mr-3'>
                                            <MaterialCommunityIcons name="dumbbell" size={28} color="#6366F1" />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='text-gray-400 font-pmedium text-sm mb-1'>
                                                Exercise History
                                            </Text>
                                            <Text className='text-white font-pextrabold text-2xl'>
                                                {exerciseName}
                                            </Text>
                                        </View>
                                    </View>

                                    {groupedSets.length > 0 && (
                                        <View className='flex-row gap-3 mt-4 pt-4 border-t border-gray-700'>
                                            <View className='flex-1 bg-accent/10 rounded-xl p-3'>
                                                <Text className='text-accent font-pbold text-xl'>
                                                    {groupedSets.length}
                                                </Text>
                                                <Text className='text-accent/70 font-pmedium text-xs'>
                                                    Workouts
                                                </Text>
                                            </View>
                                            <View className='flex-1 bg-accent/10 rounded-xl p-3'>
                                                <Text className='text-accent font-pbold text-xl'>
                                                    {groupedSets.reduce((sum, sets) => sum + sets.length, 0)}
                                                </Text>
                                                <Text className='text-accent/70 font-pmedium text-xs'>
                                                    Total Sets
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </SafeAreaView>
                        }
                        ListEmptyComponent={
                            <View className='flex-1 justify-center items-center px-8 py-20'>
                                <View className='bg-accent/10 rounded-full p-8 mb-6'>
                                    <MaterialCommunityIcons
                                        name="history"
                                        size={80}
                                        color="#6366F1"
                                    />
                                </View>

                                <Text className='text-white text-2xl font-pextrabold text-center mb-3'>
                                    No History Yet
                                </Text>

                                <Text className='text-gray-400 text-base font-pmedium text-center mb-6 leading-6'>
                                    You haven't performed {exerciseName} in any workouts yet. Start tracking to see your progress!
                                </Text>

                                <View className='w-full bg-surface border-2 border-accent/20 rounded-2xl p-5'>
                                    <View className='flex-row items-center mb-3'>
                                        <MaterialCommunityIcons name="chart-line-variant" size={24} color="#6366F1" />
                                        <Text className='text-white font-pbold text-base ml-3'>
                                            Track Your Performance
                                        </Text>
                                    </View>
                                    <Text className='text-gray-400 font-pmedium text-sm leading-5'>
                                        Complete workouts with this exercise to track sets, reps, weight progression, and personal records over time.
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                </View>

            </SafeAreaView>
        </Modal>
    )
}

export default ExerciseHistory