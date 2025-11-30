import { Text, View, Modal, TextInput, Alert, FlatList, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { TouchableOpacity } from 'react-native'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

import AddExercise from '@/components/ExerciseScreen/AddExercise';


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
    user_id: string
    id: string
}


interface CreateWorkoutProps {
    showCreateWorkout: boolean,
    setShowCreateWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    exercises: ExerciseList[],
    setRefresh: React.Dispatch<React.SetStateAction<number>>
    refresh: number
}

type bodyPartToFilterMap = Map<string, number>
type categoryToFilterMap = Map<string, number>


interface BodyParts {
    id: number
    value: string
}

interface CategoriesToFilter {
    id: number
    value: string
}

const CATEGORIES: CategoriesToFilter[] = [
    { id: 1, value: 'Barbell' },
    { id: 2, value: 'Dumbbell' },
    { id: 3, value: 'Machine' },
    { id: 4, value: 'Bodyweight' },
    { id: 5, value: 'Other' }
]


const BODY_PARTS: BodyParts[] = [
    { id: 1, value: 'Chest' },
    { id: 2, value: 'Back' },
    { id: 3, value: 'Legs' },
    { id: 4, value: 'Shoulders' },
    { id: 5, value: 'Arms' },
    { id: 6, value: 'Core' }
];

const CreateWorkout = ({ showCreateWorkout, setShowCreateWorkout, exercises, setRefresh, refresh }: CreateWorkoutProps) => {
    const [selectedExercises, setSelectedExercises] = useState<UserExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<UserExercise>({} as UserExercise);
    const [workoutName, setWorkoutName] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
    const [filteredExercises, setFilteredExercises] = useState<ExerciseList[]>([])

    const [bodyParts, setBodyParts] = useState<bodyPartToFilterMap>(new Map());
    const [bodyPartsSelected, setBodyPartsSelected] = useState<bodyPartToFilterMap>(new Map());
    const [showBodyPartFilter, setShowBodyPartFilter] = useState<boolean>(false);

    const [categories, setCategories] = useState<categoryToFilterMap>(new Map())
    const [categoriesSelected, setCategoriesSelected] = useState<categoryToFilterMap>(new Map())
    const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);

    const [showMyExercisesOnly, setShowMyExercisesOnly] = useState<boolean>(false);

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

    const handleAddExercise = async (
        exercise: {
            exercise_name: string,
            exercise_bodypart: string,
            exercise_category: string,
            exercise_instructions: string
        }
    ) => {
        try {
            const response = await axiosPrivate.post(`${EXERCISES_URL}/add`, {
                exerciseName: exercise.exercise_name,
                exerciseCategory: exercise.exercise_category,
                exerciseBodyPart: exercise.exercise_bodypart,
                exerciseInstructions: exercise.exercise_instructions,
                userId: auth.userId
            });
            if (response.status === 201) {
                setRefresh(refresh + 1)
                setAddModalVisible(false);
                Alert.alert("Exercise Added", "Your exercise was succesfully added")
            }
        } catch (error) {
            console.error('Failed to add exercise:', error);
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
        clearAllFilters()
    }


    const clearAllFilters = () => {
        setShowMyExercisesOnly(false);
        setCategories(new Map())
        setBodyParts(new Map())
        setFilteredExercises(exercises)
        setBodyPartsSelected(new Map())
        setCategoriesSelected(new Map())
    }

    const removeMyExercisesFilter = () => {
        setShowMyExercisesOnly(false)
    }

    const removeBodyPartFilter = (bodyPart: string) => {
        const newMap = new Map(bodyParts)
        newMap.delete(bodyPart)
        setBodyParts(newMap)
    }

    const removeCategoryFilter = (category: string) => {
        const newMap = new Map(categories)
        newMap.delete(category)
        setCategories(newMap)
    }

    const filterByBodyPart = () => {
        setBodyParts(bodyPartsSelected)
        setShowBodyPartFilter(false);
    }


    const filterByCategory = () => {
        setCategories(categoriesSelected)
        setShowCategoryFilter(false);
    }

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
        <MenuProvider>
            <View className='flex-1 bg-primary'>

                <View className='px-6 pt-6 pb-2'>
                    <Text className='text-white text-4xl font-pextrabold mb-2'>Add Exercises</Text>
                    <Text className='text-gray-400 text-base font-pmedium'>
                        {selectedExercises.length > 0
                            ? `${selectedExercises.length} exercise${selectedExercises.length !== 1 ? 's' : ''} selected`
                            : 'Tap exercises to add them to your workout'}
                    </Text>
                </View>


                <View className='px-6 pt-4 pb-4'>
                    <View className='flex-row gap-3'>

                        <View className='flex-1 bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
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


                        <TouchableOpacity
                            className='bg-surface border-2 border-gray-700 rounded-2xl px-4 items-center justify-center'
                            onPress={() => setAddModalVisible(true)}
                        >
                            <AntDesign name="plus" size={20} color="#6366F1" />
                        </TouchableOpacity>


                        <Menu>
                            <MenuTrigger
                                customStyles={{
                                    triggerTouchable: { underlayColor: 'transparent' },
                                    triggerWrapper: {
                                        backgroundColor: '#1F2937',
                                        borderWidth: 2,
                                        borderColor: '#374151',
                                        borderRadius: 16,
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                    }
                                }}
                            >
                                <AntDesign name="filter" size={20} color="#6366F1" />
                            </MenuTrigger>
                            <MenuOptions
                                optionsContainerStyle={{
                                    backgroundColor: '#1F2937',
                                    borderRadius: 12,
                                    marginTop: 40,
                                    borderWidth: 1,
                                    borderColor: '#374151',
                                    overflow: 'hidden',
                                    minWidth: 180,

                                }}
                            >
                                <MenuOption
                                    onSelect={() => setShowBodyPartFilter(true)}
                                    style={{
                                        padding: 14,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                                        <AntDesign name="tags" size={14} color="#6366F1" />
                                    </View>
                                    <Text className="text-white text-base font-pmedium">Body Part</Text>
                                </MenuOption>
                                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                                <MenuOption
                                    onSelect={() => setShowCategoryFilter(true)}
                                    style={{
                                        padding: 14,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                                        <AntDesign name="appstore-o" size={14} color="#6366F1" />
                                    </View>
                                    <Text className="text-white text-base font-pmedium">Category</Text>
                                </MenuOption>
                                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                                <MenuOption
                                    onSelect={() => setShowMyExercisesOnly(true)}
                                    style={{
                                        padding: 14,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                                        <AntDesign name="user" size={14} color="#6366F1" />
                                    </View>
                                    <Text className="text-white text-base font-pmedium">My Exercises</Text>
                                </MenuOption>
                                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>

                {(showMyExercisesOnly || bodyParts.size > 0 || categories.size > 0) && (
                    <View className='px-5 mb-4'>
                        <View className='flex-row items-center mb-2'>
                            <Text className='text-gray-400 font-pmedium text-sm'>Active Filters:</Text>
                            <TouchableOpacity
                                onPress={clearAllFilters}
                                className='ml-auto'
                            >
                                <Text className='text-accent font-psemibold text-sm'>Clear All</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='flex-row flex-wrap gap-2'>
                            {showMyExercisesOnly && (
                                <View className='bg-accent/20 border-2 border-accent rounded-xl px-3 py-1.5 flex-row items-center'>
                                    <Text className='text-accent font-pmedium text-sm mr-2'>My Exercises</Text>
                                    <TouchableOpacity onPress={removeMyExercisesFilter}>
                                        <AntDesign name="close" size={14} color="#6366F1" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {Array.from(bodyParts.keys()).map((bodyPart) => (
                                <View
                                    key={bodyPart}
                                    className='bg-secondary-200/20 border-2 border-secondary-200 rounded-xl px-3 py-1.5 flex-row items-center'
                                >
                                    <Text className='text-secondary-200 font-pmedium text-sm mr-2'>{bodyPart}</Text>
                                    <TouchableOpacity onPress={() => removeBodyPartFilter(bodyPart)}>
                                        <AntDesign name="close" size={14} color="#FF9C01" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {Array.from(categories.keys()).map((category) => (
                                <View
                                    key={category}
                                    className='bg-green-500/20 border-2 border-green-500 rounded-xl px-3 py-1.5 flex-row items-center'
                                >
                                    <Text className='text-green-500 font-pmedium text-sm mr-2'>{category}</Text>
                                    <TouchableOpacity onPress={() => removeCategoryFilter(category)}>
                                        <AntDesign name="close" size={14} color="#10B981" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const isSelected = selectedExercises.find(ex => ex.exercise_name === item.exercise_name);
                        return (
                            <TouchableOpacity
                                onPress={() => handleToggleExercise({ exercise_name: item.exercise_name })}
                                className={`mx-4 mb-3 rounded-2xl p-4 border-2 ${isSelected ? 'bg-accent/10 border-accent' : 'bg-surface border-gray-700'
                                    }`}
                            >
                                <View className='flex-row items-center justify-between'>
                                    <View className='gap-1'>
                                        <View>
                                            <Text className={`text-lg font-pbold ${isSelected ? 'text-accent' : 'text-white'
                                                }`}>
                                                {item.exercise_name}
                                            </Text>
                                        </View>
                                        <View className='flex-row items-center gap-2'>
                                            <View className="rounded-full px-3 py-1" style={{ backgroundColor: '#6366F120' }}>
                                                <Text className="text-xs font-pmedium" style={{ color: '#6366F1' }}>
                                                    {item.exercise_bodypart}
                                                </Text>
                                            </View>
                                            <View className="rounded-full px-3 py-1" style={{ backgroundColor: '#6366F120'}}>
                                                <Text className="text-xs font-pmedium" style={{ color: '#6366F1' }}>
                                                    {item.exercise_category}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
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
        </MenuProvider>
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

    const renderBodyPartFilter = ({ item }: { item: BodyParts }) => {
        let name = item.value
        const isSelected = bodyPartsSelected.get(name) !== undefined;

        const toggleBodyPart = () => {
            const newMap = new Map(bodyPartsSelected);
            if (isSelected) {
                newMap.delete(name);
            } else {
                newMap.set(name, 1);
            }
            setBodyPartsSelected(newMap);
        };

        return (
            <TouchableOpacity
                className={isSelected
                    ? "bg-secondary/20 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                    : "bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                }
                onPress={toggleBodyPart}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-pmedium mb-1">
                            {name}
                        </Text>
                    </View>

                    <View className="bg-secondary/20 p-2 rounded-xl">
                        {
                            isSelected ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#FF9C01"
                                />
                                : <View>
                                </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const renderCategoryItems = ({ item }: { item: CategoriesToFilter }) => {

        let category = item.value;
        let isSelected = categoriesSelected.get(category) !== undefined

        const toggleCategory = () => {
            const newMap = new Map(categoriesSelected)
            if (isSelected) {
                newMap.delete(category)
            } else {
                newMap.set(category, 1)
            }

            setCategoriesSelected(newMap)
        }

        return (
            <TouchableOpacity
                className={isSelected
                    ? "bg-secondary/20 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                    : "bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
                }
                onPress={toggleCategory}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-pmedium mb-1">
                            {category}
                        </Text>
                    </View>

                    <View className="bg-secondary/20 p-2 rounded-xl">
                        {
                            isSelected ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#FF9C01"
                                />
                                : <View>
                                </View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const applyAllFilters = () => {
        let filtered = exercises;

        filtered = filtered.filter(exercise =>
            exercise.exercise_name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );

        // Filter by user's exercises if enabled
        if (showMyExercisesOnly) {
            filtered = filtered.filter(exercise => exercise.user_id === auth.userId);
        }

        // Filter by body parts
        if (bodyParts.size > 0) {
            filtered = filtered.filter(exercise =>
                bodyParts.get(exercise.exercise_bodypart) !== undefined
            );
        }

        // Filter by categories
        if (categories.size > 0) {
            filtered = filtered.filter(exercise =>
                categories.get(exercise.exercise_category) !== undefined
            );
        }

        setFilteredExercises(filtered);
    };

    useEffect(() => {

        applyAllFilters();
    }, [bodyParts, categories, showMyExercisesOnly, exercises, searchQuery])


    console.log(bodyParts)
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
                                className={`h-2 rounded-full ${step === currentStep ? 'w-8 bg-accent' : 'w-2 bg-gray-700'
                                    }`}
                            />
                        ))}
                    </View>
                    <View className='w-6' />
                </View>


                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}


                {
                    showBodyPartFilter && (
                        <Modal
                            visible={showBodyPartFilter}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => {
                                setShowBodyPartFilter(false)
                                setBodyPartsSelected(new Map())
                            }}
                        >
                            <View className="flex-1 bg-black/80 justify-end">
                                <View className="bg-surface rounded-t-3xl border-t-2 border-accent/30">

                                    <View className="items-center py-3">
                                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                                    </View>

                                    <View className="flex-row justify-between items-center px-6 pb-4">
                                        <View className="flex-1">
                                            <Text className="text-white text-2xl font-pbold mb-1">Filter by Body Part</Text>
                                            <Text className="text-gray-400 font-pmedium text-sm">
                                                {bodyPartsSelected.size > 0 ? `${bodyPartsSelected.size} selected` : 'Select one or more'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowBodyPartFilter(false)
                                                setBodyPartsSelected(bodyParts)
                                            }}
                                            className="bg-gray-700 p-2 rounded-xl"
                                        >
                                            <AntDesign name="close" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    <View className="max-h-96">
                                        <FlatList
                                            data={BODY_PARTS}
                                            renderItem={renderBodyPartFilter}
                                            keyExtractor={item => item.id.toString()}
                                            contentContainerStyle={{ paddingBottom: 16 }}
                                        />
                                    </View>

                                    <View className="px-6 pb-8 pt-4 border-t border-gray-700">
                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                onPress={() => {

                                                    setFilteredExercises(exercises);
                                                    setBodyPartsSelected(new Map())

                                                }}
                                                className="flex-1 bg-gray-700 rounded-xl py-3.5 items-center"
                                            >
                                                <Text className="text-white font-psemibold text-base">Clear</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={filterByBodyPart}
                                                className="flex-1 bg-accent rounded-xl py-3.5 items-center"
                                            >
                                                <Text className="text-white font-psemibold text-base">Apply Filter</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )
                }
                {
                    showCategoryFilter && (
                        <Modal
                            visible={showCategoryFilter}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => {
                                setShowCategoryFilter(false)
                                setCategoriesSelected(new Map())
                            }}
                        >
                            <View className="flex-1 bg-black/80 justify-end">
                                <View className="bg-surface rounded-t-3xl border-t-2 border-accent/30">


                                    <View className="items-center py-3">
                                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                                    </View>


                                    <View className="flex-row justify-between items-center px-6 pb-4">
                                        <View className="flex-1">
                                            <Text className="text-white text-2xl font-pbold mb-1">Filter by Category</Text>
                                            <Text className="text-gray-400 font-pmedium text-sm">
                                                {categoriesSelected.size > 0 ? `${categoriesSelected.size} selected` : 'Select one or more'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowCategoryFilter(false)
                                                setCategoriesSelected(categories)
                                            }}
                                            className="bg-gray-700 p-2 rounded-xl"
                                        >
                                            <AntDesign name="close" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>


                                    <View className="max-h-96">
                                        <FlatList
                                            data={CATEGORIES}
                                            renderItem={renderCategoryItems}
                                            keyExtractor={item => item.id.toString()}
                                            contentContainerStyle={{ paddingBottom: 16 }}
                                        />
                                    </View>


                                    <View className="px-6 pb-8 pt-4 border-t border-gray-700">
                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFilteredExercises(exercises);
                                                    setCategoriesSelected(new Map())
                                                }}
                                                className="flex-1 bg-gray-700 rounded-xl py-3.5 items-center"
                                            >
                                                <Text className="text-white font-psemibold text-base">Clear</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={filterByCategory}
                                                className="flex-1 bg-accent rounded-xl py-3.5 items-center"
                                            >
                                                <Text className="text-white font-psemibold text-base">Apply Filter</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )
                }
                <AddExercise
                    visible={addModalVisible}
                    onClose={() => setAddModalVisible(false)}
                    onSubmit={handleAddExercise}
                />

            </SafeAreaView>
        </Modal>
    );
};


export default CreateWorkout
