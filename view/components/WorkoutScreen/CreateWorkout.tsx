import { Text, View, Modal, TextInput, Alert, FlatList, StatusBar } from 'react-native'
import React, { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const EXERCISES_URL = '/api/exercises';
const WORKOUT_URL = '/api/workouts';

interface UserExercise {
    exercise_name: string,
}

interface ExerciseList {
    exercise_name: string,
    exercise_category: string,
    exercise_bodypart: string,
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
    const [currentStep, setCurrentStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const handleCreateWorkout = async () => {
        if (selectedExercises.length === 0) {
            Alert.alert("No Exercises Selected", "Please select at least one exercise to create a workout");
            return;
        }

        if (!workoutName.trim()) {
            Alert.alert("No Workout Name", "Please enter a workout name");
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

            Alert.alert("Workout Created", `"${workoutName}" has been created successfully!`);
            setRefresh(refresh + 1);
            handleClose();
        } catch (err) {
            console.error(err)
            Alert.alert("Error", "Failed to create workout. Please try again.");
        }
    }

    const handleToggleExercise = (item: UserExercise) => {
        const found = selectedExercises.find(exercise => exercise.exercise_name === item.exercise_name);
        if (found) {
            // Remove if already selected
            const updatedExercises = selectedExercises.filter((exercise) => exercise.exercise_name !== item.exercise_name);
            setSelectedExercises(updatedExercises);
        } else {
            // Add if not selected
            setSelectedExercises([...selectedExercises, item]);
        }
    }

    const handleRemoveExercise = (name: string) => {
        const updatedExercises = selectedExercises.filter((exercise) => exercise.exercise_name !== name);
        setSelectedExercises(updatedExercises);
    }

    const handleNext = () => {
        if (currentStep === 1 && !workoutName.trim()) {
            Alert.alert("No Workout Name", "Please enter a workout name");
            return;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    const handleClose = () => {
        setShowCreateWorkout(false);
        setCurrentStep(1);
        setWorkoutName('');
        setSelectedExercises([]);
        setSearchQuery('');
    }

    // Filter exercises based on search query
    const filteredExercises = exercises.filter(exercise =>
        exercise.exercise_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStep1 = () => (
        <View className='flex-1 bg-primary px-6'>
            <View className='flex-1 justify-center'>
                <View className='mb-8'>
                    <Text className='text-white text-4xl font-pextrabold mb-3'>Name Your Workout</Text>
                    <Text className='text-gray-400 text-lg font-pmedium'>Give your workout a memorable name</Text>
                </View>

                <View className='mb-8'>
                    <Text className='text-sm text-gray-300 font-pmedium mb-3'>Workout Name</Text>
                    <View className='border-2 border-gray-700 w-full h-16 px-5 bg-surface rounded-2xl flex flex-row items-center'>
                        <TextInput
                            value={workoutName}
                            onChangeText={setWorkoutName}
                            placeholder="e.g., Upper Body Day, Leg Day, Full Body"
                            placeholderTextColor="#6B7280"
                            className="text-white w-full font-pmedium text-lg"
                            autoFocus
                        />
                    </View>
                </View>
            </View>

            <View className='pb-8'>
                <TouchableOpacity
                    onPress={handleNext}
                    className='bg-accent rounded-2xl py-4 mb-3 active:scale-95'
                >
                    <Text className='text-white text-center font-pbold text-lg'>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleClose}
                    className='bg-gray-700 py-4 rounded-2xl active:bg-gray-600'
                >
                    <Text className='text-white text-center font-pbold text-lg'>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View className='flex-1 bg-primary'>
            <View className='px-6 pt-6 pb-4'>
                <Text className='text-white text-4xl font-pextrabold mb-3'>Add Exercises</Text>
                <Text className='text-gray-400 text-base font-pmedium mb-4'>
                    {selectedExercises.length > 0
                        ? `${selectedExercises.length} exercise${selectedExercises.length !== 1 ? 's' : ''} selected`
                        : 'Tap exercises to add them to your workout'}
                </Text>

                <View className='bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4 mb-4'>
                    <AntDesign name="search1" size={20} color="#6B7280" />
                    <TextInput
                        className='text-white flex-1 ml-3 font-pmedium text-base'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search exercises..."
                        placeholderTextColor='#6B7280'
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <AntDesign name="closecircle" size={18} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                renderItem={({ item }) => {
                    const isSelected = selectedExercises.find(ex => ex.exercise_name === item.exercise_name);
                    return (
                        <TouchableOpacity
                            onPress={() => handleToggleExercise({ exercise_name: item.exercise_name })}
                            className={`mx-4 mb-3 rounded-2xl p-4 border-2 ${
                                isSelected ? 'bg-accent/10 border-accent' : 'bg-surface border-gray-700'
                            }`}
                        >
                            <View className='flex-row items-center justify-between'>
                                <Text className={`text-lg font-pbold flex-1 ${
                                    isSelected ? 'text-accent' : 'text-white'
                                }`}>
                                    {item.exercise_name}
                                </Text>
                                {isSelected && (
                                    <View className='bg-accent rounded-full p-1.5'>
                                        <AntDesign name="check" size={16} color="white" />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            <View className='absolute bottom-0 left-0 right-0 bg-primary border-t-2 border-gray-700 px-6 py-4'>
                <View className='flex-row gap-3'>
                    <TouchableOpacity
                        onPress={handleBack}
                        className='flex-1 bg-gray-700 rounded-2xl py-4 active:bg-gray-600'
                    >
                        <Text className='text-white text-center font-pbold text-lg'>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNext}
                        className='flex-1 bg-accent rounded-2xl py-4 active:scale-95'
                    >
                        <Text className='text-white text-center font-pbold text-lg'>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View className='flex-1 bg-primary px-6'>
            <ScrollView className='flex-1 pt-6' showsVerticalScrollIndicator={false}>
                <Text className='text-white text-4xl font-pextrabold mb-3'>Review Workout</Text>
                <Text className='text-gray-400 text-base font-pmedium mb-6'>
                    Make sure everything looks good before saving
                </Text>

                <View className='mb-6'>
                    <Text className='text-sm text-gray-300 font-pmedium mb-2'>Workout Name</Text>
                    <View className='bg-surface border-2 border-gray-700 rounded-2xl p-4'>
                        <Text className='text-white font-pbold text-lg'>{workoutName}</Text>
                    </View>
                </View>

                <View className='mb-6'>
                    <Text className='text-sm text-gray-300 font-pmedium mb-3'>
                        Exercises ({selectedExercises.length})
                    </Text>
                    {selectedExercises.length > 0 ? (
                        <View className='flex gap-3'>
                            {selectedExercises.map((exercise, i) => (
                                <View key={i} className='bg-surface rounded-2xl p-4 border-2 border-gray-700 flex-row justify-between items-center'>
                                    <Text className='text-white font-pmedium text-base flex-1'>{exercise.exercise_name}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleRemoveExercise(exercise.exercise_name)}
                                        className='bg-red-500/20 p-2 rounded-lg ml-3'
                                    >
                                        <AntDesign name="delete" size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className='bg-gray-700/30 rounded-2xl p-6 items-center'>
                            <AntDesign name="inbox" size={48} color="#6B7280" />
                            <Text className='text-gray-400 font-pmedium text-base mt-3 text-center'>
                                No exercises added yet
                            </Text>
                            <TouchableOpacity
                                onPress={handleBack}
                                className='mt-4'
                            >
                                <Text className='text-accent font-psemibold text-base'>Add Exercises</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className='pb-8 pt-4'>
                <TouchableOpacity
                    onPress={handleCreateWorkout}
                    className='bg-accent rounded-2xl py-4 mb-3 active:scale-95'
                    disabled={selectedExercises.length === 0}
                    style={{ opacity: selectedExercises.length === 0 ? 0.5 : 1 }}
                >
                    <Text className='text-white text-center font-pbold text-lg'>Create Workout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleBack}
                    className='bg-gray-700 py-4 rounded-2xl active:bg-gray-600'
                >
                    <Text className='text-white text-center font-pbold text-lg'>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            visible={showCreateWorkout}
            animationType="slide"
            onRequestClose={handleClose}
            presentationStyle="fullScreen"
            statusBarTranslucent={false}
        >
            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-700'>
                    <TouchableOpacity onPress={handleClose}>
                        <AntDesign name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View className='flex-row gap-2'>
                        {[1, 2, 3].map((step) => (
                            <View
                                key={step}
                                className={`h-2 rounded-full ${
                                    step === currentStep ? 'w-8 bg-accent' : 'w-2 bg-gray-700'
                                }`}
                            />
                        ))}
                    </View>
                    <View className='w-6' />
                </View>

               
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </SafeAreaView>
        </Modal>
    );
};


export default CreateWorkout
