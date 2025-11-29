import { View, Text, Modal, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import useAuth from '@/hooks/useAuth'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';

interface TemplateExercises {
    id: number
    exercise_name: string
    workout_template_id: number
}


interface ViewTemplateProps {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    workoutTemplateExercises: TemplateExercises[];
    workoutTemplateId: number;
    workoutTemplateName: string;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
    onClose: () => void;
}

const ViewWorkoutTemplate = ({ visible, setVisible, workoutTemplateExercises, workoutTemplateId, workoutTemplateName, refresh, setRefresh, onClose }: ViewTemplateProps) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate()

    const filteredExercises = workoutTemplateExercises.filter(exercise =>
        exercise.workout_template_id === workoutTemplateId
    );

    const handleCreateWorkout = async () => {


        try {
            const response = await axiosPrivate.post(WORKOUT_URL, {
                userId: auth.userId,
                workoutName: workoutTemplateName,
            })

            const workoutId = response.data.workoutId;

            await axiosPrivate.post(EXERCISES_URL, {
                workoutId,
                selectedExercises: filteredExercises
            })

            Alert.alert("Workout Created", "Workout has been created successfully!");
            setRefresh(refresh + 1);
            onClose();
            setVisible(false)

        } catch (err) {
            console.error(err)
            Alert.alert("Error", "Failed to create workout. Please try again.");
        }
    }


    const renderExercises = ({ item, index }: { item: TemplateExercises, index: number }) => (
        <View className='mx-5 mb-3 bg-surface rounded-2xl border-2 border-gray-700 p-4 flex-row items-center'>
            <View className='bg-accent/20 rounded-full w-10 h-10 items-center justify-center mr-4'>
                <Text className='text-accent font-pbold text-base'>{index + 1}</Text>
            </View>
            <View className='flex-1'>
                <Text className='text-white font-pmedium text-base' numberOfLines={2}>
                    {item.exercise_name}
                </Text>
            </View>
            <View className='bg-gray-700 rounded-full p-2'>
                <Icon name="fitness-center" size={18} color="#6B7280" />
            </View>
        </View>
    );

    const renderHeader = () => (
        <View className='px-5 pb-4'>
            <View className='bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 flex-row items-center mb-4'>
                <View className='bg-accent rounded-full p-3 mr-4'>
                    <Icon name="content-copy" size={24} color="white" />
                </View>
                <View className='flex-1'>
                    <Text className='text-white font-pbold text-sm mb-1'>Template Preview</Text>
                    <Text className='text-gray-400 font-pmedium text-xs'>
                        {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} in this template
                    </Text>
                </View>
            </View>
            <Text className='text-gray-400 font-pmedium text-sm mb-3'>Exercises</Text>
        </View>
    );

    const renderFooter = () => (
        <View className='px-5 pt-4 pb-2'>
            <TouchableOpacity
                onPress={handleCreateWorkout}
                className='bg-accent rounded-2xl py-4 active:scale-95 shadow-lg shadow-accent/40 flex-row items-center justify-center'
            >
                <Icon name="add-circle-outline" size={24} color="white" style={{ marginRight: 8 }} />
                <Text className='text-white text-center font-pbold text-lg'>Use This Template</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={() => setVisible(false)}
            presentationStyle="fullScreen"
            statusBarTranslucent={false}
        >
            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                <View className='flex-row items-center justify-between px-5 py-4 border-b-2 border-gray-700'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-white font-pextrabold text-3xl mb-1' numberOfLines={1}>
                            {workoutTemplateName}
                        </Text>
                        <Text className='text-gray-400 font-pmedium text-sm'>
                            Preview template exercises
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setVisible(false)}
                        className='bg-gray-700 p-3 rounded-xl'
                    >
                        <AntDesign name="close" size={22} color="white" />
                    </TouchableOpacity>
                </View>


                <FlatList
                    data={filteredExercises}
                    renderItem={renderExercises}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default ViewWorkoutTemplate;
