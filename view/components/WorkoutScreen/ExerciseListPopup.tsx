import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, FlatList, Alert, Modal, StatusBar } from 'react-native'
import fetchExercises from '@/hooks/fetchExercises';
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useAuth from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

const EXERCISE_API = '/api/exercises';

//Interface used for the exercise that are in their workout not list that they can choose from
interface Exercise {
    id: number,
    exercise_name: string,
    workout_id: string
}

//Interface used for set of exercises that users can choose from not the exercises in their workout
interface ExerciseList {
    exercise_name: string,
    exercise_bodypart: string,
    exercise_instructions: string,
    exercise_category: string
    user_id: string
    id: string
}

interface AddExerciseProps {
    toggleAddExercise: boolean
    setToggleAddExercise: (val: boolean) => void
    workoutExercises: Exercise[]
    setWorkoutExercises: (val: Exercise[]) => void
    toggleReplaceExercise: boolean
    setToggleReplaceExercise: (val: boolean) => void
    exerciseToReplace?: string
    workoutId: Number,
    refresh: number,
    setRefresh: (val: number) => void
}

interface ExerciseItem {
    item: ExerciseList
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


const ExerciseListPopup = ({
    toggleAddExercise,
    setToggleAddExercise,
    workoutExercises,
    setWorkoutExercises,
    toggleReplaceExercise,
    setToggleReplaceExercise,
    exerciseToReplace,
    workoutId,
    refresh,
    setRefresh
}: AddExerciseProps) => {

    const { auth } = useAuth();
    const [selectedExercises, setSelectedExercises] = useState<string[]>([])

    const { exercises } = fetchExercises();
    const [filteredExercises, setFilteredExercises] = useState<ExerciseList[]>([] as ExerciseList[]);
    const [searchData, setSearchData] = useState('');
    const [currentExercises, setCurrentExercises] = useState<string[]>([]);
    const [showExerciseInfo, setShowExerciseInfo] = useState(false);
    const [activeExercise, setActiveExercise] = useState<ExerciseList>({} as ExerciseList);
    const axiosPrivate = useAxiosPrivate();

    // Filter states
    const [bodyParts, setBodyParts] = useState<bodyPartToFilterMap>(new Map());
    const [bodyPartsSelected, setBodyPartsSelected] = useState<bodyPartToFilterMap>(new Map());
    const [showBodyPartFilter, setShowBodyPartFilter] = useState<boolean>(false);

    const [categories, setCategories] = useState<categoryToFilterMap>(new Map())
    const [categoriesSelected, setCategoriesSelected] = useState<categoryToFilterMap>(new Map())
    const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);

    const [showMyExercisesOnly, setShowMyExercisesOnly] = useState<boolean>(false);


    useEffect(() => {
        if (exerciseToReplace) {
            const newExercises = workoutExercises.filter((exercise) => exercise.exercise_name !== exerciseToReplace);
            setCurrentExercises(newExercises.map((exercise) => exercise.exercise_name));
        }
        else {
            const names = workoutExercises.map((exercise) => exercise.exercise_name);
            setCurrentExercises(names);
        }
    }, [])


    const handleAddExercise = (exerciseName: string) => {

        if (toggleReplaceExercise && exerciseName === exerciseToReplace) {
            setSelectedExercises([])
            Alert.alert("Duplicate Exercise", "You cannot replace an exercise with itself");
            return;
        } else if (toggleReplaceExercise && selectedExercises.includes(exerciseName)) {
            setSelectedExercises([])
        } else if (toggleReplaceExercise && selectedExercises.length > 0) {
            setSelectedExercises([exerciseName])
            return;
        }

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
        try {
            await axiosPrivate.patch(EXERCISE_API, {
                workoutId: workoutId,
                selectedExercises: selectedExercises,
                replace: toggleReplaceExercise,
                exerciseToReplace: exerciseToReplace
            })

            setToggleAddExercise(false)
            setToggleReplaceExercise(false)
            setSelectedExercises([])
            setSearchData('')
            setFilteredExercises([])
            setActiveExercise({} as ExerciseList)
            clearAllFilters()
            setRefresh(refresh + 1)
        } catch (error) {
            console.error(error)
        }
    }

    // Filter functions
    const applyAllFilters = () => {
        let filtered = exercises;

        filtered = filtered.filter(exercise =>
            exercise.exercise_name.toLowerCase().startsWith(searchData.toLowerCase())
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

    const filterByBodyPart = () => {
        setBodyParts(bodyPartsSelected)
        setShowBodyPartFilter(false);
    }

    const filterByCategory = () => {
        setCategories(categoriesSelected)
        setShowCategoryFilter(false);
    }

    const removeBodyPartFilter = (bodyPart: string) => {
        const newBodyParts = new Map(bodyParts);
        newBodyParts.delete(bodyPart);
        setBodyParts(newBodyParts);
    };

    const removeCategoryFilter = (category: string) => {
        const newCategories = new Map(categories);
        newCategories.delete(category);
        setCategories(newCategories);
    };

    const removeMyExercisesFilter = () => {
        setShowMyExercisesOnly(false);
    };

    const clearAllFilters = () => {
        setBodyParts(new Map());
        setCategories(new Map());
        setShowMyExercisesOnly(false);
        setBodyPartsSelected(new Map())
        setCategoriesSelected(new Map())
    };


    useEffect(() => {
        applyAllFilters()
    }, [bodyParts, categories, showMyExercisesOnly, exercises, searchData])


    const renderExercise = ({ item }: ExerciseItem) => {
        const isUserCreated = item.user_id === auth.userId;
        const isSelected = selectedExercises.includes(item.exercise_name);

        return (
            <TouchableOpacity
                className={isSelected
                    ? "bg-accent/20 mx-4 mb-3 rounded-2xl p-4 border-2 border-accent active:opacity-80"
                    : "bg-surface mx-4 mb-3 rounded-2xl p-4 border-2 border-gray-700 active:opacity-80"
                }
                onPress={() => {
                    handleAddExercise(item.exercise_name)
                }}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Text className="text-white text-lg font-pbold">
                                {item.exercise_name}
                            </Text>
                            {isUserCreated && (
                                <View className="bg-accent/20 px-2 py-0.5 rounded-md">
                                    <Text className="text-accent text-xs font-pmedium">Custom</Text>
                                </View>
                            )}
                        </View>
                        <View className="flex-row items-center">
                            <View className="rounded-full px-3 py-1 self-start" style={{ backgroundColor: '#6366F120' }}>
                                <Text className="text-xs font-pmedium" style={{ color: '#6366F1' }}>
                                    {item.exercise_bodypart}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-accent/20 p-2 rounded-xl">
                        {
                            isSelected ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#6366F1"
                                />
                                :
                                <TouchableOpacity onPress={() => {
                                    setShowExerciseInfo(true);
                                    setActiveExercise(item)
                                }}>
                                    <AntDesign
                                        name="question"
                                        size={20}
                                        color="#6366F1"
                                    />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

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
                    ? "bg-accent/20 mx-4 mb-3 rounded-2xl p-4 border-2 border-accent active:opacity-80"
                    : "bg-surface mx-4 mb-3 rounded-2xl p-4 border-2 border-gray-700 active:opacity-80"
                }
                onPress={toggleBodyPart}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-pmedium mb-1">
                            {name}
                        </Text>
                    </View>

                    <View className="bg-accent/20 p-2 rounded-xl">
                        {
                            isSelected ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#6366F1"
                                />
                                : <View></View>
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
                    ? "bg-accent/20 mx-4 mb-3 rounded-2xl p-4 border-2 border-accent active:opacity-80"
                    : "bg-surface mx-4 mb-3 rounded-2xl p-4 border-2 border-gray-700 active:opacity-80"
                }
                onPress={toggleCategory}
            >
                <View className="w-full flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-lg font-pmedium mb-1">
                            {category}
                        </Text>
                    </View>

                    <View className="bg-accent/20 p-2 rounded-xl">
                        {
                            isSelected ?
                                <AntDesign
                                    name="check"
                                    size={20}
                                    color="#6366F1"
                                />
                                : <View></View>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Modal
            visible={toggleAddExercise || toggleReplaceExercise}
            animationType="slide"
            onRequestClose={() => {
                setToggleAddExercise(false)
                setToggleReplaceExercise(false)
                clearAllFilters()
            }}
            presentationStyle="fullScreen"
            statusBarTranslucent={false}
        >
            <MenuProvider>
                <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                    <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                    <View className='flex-row items-center justify-between px-5 py-4 border-b-2 border-gray-700 mt-10'>
                        <TouchableOpacity
                            className='bg-surface border-2 border-gray-700 py-2 px-4 rounded-xl'
                            onPress={() => {
                                setToggleAddExercise(false)
                                setToggleReplaceExercise(false)
                                clearAllFilters()
                            }}
                        >
                            <Text className='text-white font-pmedium'>Back</Text>
                        </TouchableOpacity>

                        <View className='flex-1 mx-4'>
                            <Text className='text-white font-pbold text-xl text-center'>
                                {toggleReplaceExercise ? 'Replace Exercise' : 'Add Exercises'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            disabled={selectedExercises.length < 1}
                            onPress={() => {
                                addSelectedExercisesToWorkout()
                            }}
                            className={selectedExercises.length > 0 ? 'bg-accent py-2 px-4 rounded-xl' : 'bg-gray-700 py-2 px-4 rounded-xl'}
                        >
                            <View className='flex-row gap-1 items-center'>
                                <Text className={selectedExercises.length > 0 ? 'text-white font-pbold' : 'text-gray-500 font-pmedium'}>
                                    {toggleReplaceExercise ? 'Replace' : 'Add'}
                                </Text>
                                {
                                    (selectedExercises.length > 0 && toggleAddExercise) &&
                                    <Text className='text-white font-pbold'>({selectedExercises.length})</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>


                    <View className='px-5 pt-4 pb-2'>
                        <View className='flex-row gap-3 '>
                            <View className='flex-1 bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
                                <AntDesign name="search" size={20} color="#6B7280" />
                                <TextInput
                                    className='text-white flex-1 ml-3 font-pmedium text-base'
                                    value={searchData}
                                    onChangeText={(val) => setSearchData(val)}
                                    placeholder="Search exercises..."
                                    placeholderTextColor='#6B7280'
                                />
                                {searchData.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchData('')}>
                                        <AntDesign name="close-circle" size={18} color="#6B7280" />
                                    </TouchableOpacity>
                                )}
                            </View>

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
                                            <AntDesign name="appstore" size={14} color="#6366F1" />
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
                                            <AntDesign name="close" size={14} color="#A5B4FC" />
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
                        renderItem={renderExercise}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />

                    {showBodyPartFilter && (
                        <Modal
                            visible={showBodyPartFilter}
                            animationType="slide"
                            onRequestClose={() => setShowBodyPartFilter(false)}
                            presentationStyle="fullScreen"
                            statusBarTranslucent={false}
                        >
                            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                                <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                                <View className='flex-row items-center justify-between px-5 py-4 border-b-2 border-gray-700'>
                                    <TouchableOpacity
                                        className='bg-surface border-2 border-gray-700 py-2 px-4 rounded-xl'
                                        onPress={() => setShowBodyPartFilter(false)}
                                    >
                                        <Text className='text-white font-pmedium'>Cancel</Text>
                                    </TouchableOpacity>

                                    <Text className='text-white font-pbold text-xl'>Filter by Body Part</Text>

                                    <TouchableOpacity
                                        className='bg-accent py-2 px-4 rounded-xl'
                                        onPress={filterByBodyPart}
                                    >
                                        <Text className='text-white font-pbold'>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={BODY_PARTS}
                                    renderItem={renderBodyPartFilter}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
                                />
                            </SafeAreaView>
                        </Modal>
                    )}

                    {showCategoryFilter && (
                        <Modal
                            visible={showCategoryFilter}
                            animationType="slide"
                            onRequestClose={() => setShowCategoryFilter(false)}
                            presentationStyle="fullScreen"
                            statusBarTranslucent={false}
                        >
                            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                                <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                                <View className='flex-row items-center justify-between px-5 py-4 border-b-2 border-gray-700'>
                                    <TouchableOpacity
                                        className='bg-surface border-2 border-gray-700 py-2 px-4 rounded-xl'
                                        onPress={() => setShowCategoryFilter(false)}
                                    >
                                        <Text className='text-white font-pmedium'>Cancel</Text>
                                    </TouchableOpacity>

                                    <Text className='text-white font-pbold text-xl'>Filter by Category</Text>

                                    <TouchableOpacity
                                        className='bg-accent py-2 px-4 rounded-xl'
                                        onPress={filterByCategory}
                                    >
                                        <Text className='text-white font-pbold'>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={CATEGORIES}
                                    renderItem={renderCategoryItems}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
                                />
                            </SafeAreaView>
                        </Modal>
                    )}

                    {showExerciseInfo && (
                        <Modal
                            visible={showExerciseInfo}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setShowExerciseInfo(false)}
                        >
                            <View className="flex-1 bg-black/80 justify-end">
                                <View className="bg-surface rounded-t-3xl border-t-2 border-accent/30">

                                    <View className="items-center py-3">
                                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                                    </View>

                                    <View className="px-6 pb-8">
                                        <View className="flex-row justify-between items-start mb-6">
                                            <View className="flex-1">
                                                <Text className="text-white text-2xl font-pbold mb-2">
                                                    {activeExercise?.exercise_name}
                                                </Text>
                                                <View className="rounded-full px-3 py-1 self-start" style={{ backgroundColor: '#6366F120' }}>
                                                    <Text className="text-sm font-pmedium" style={{ color: '#6366F1' }}>
                                                        {activeExercise?.exercise_bodypart}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => setShowExerciseInfo(false)}
                                                className="bg-gray-700 p-2 rounded-xl"
                                            >
                                                <AntDesign name="close" size={20} color="white" />
                                            </TouchableOpacity>
                                        </View>

                                        <View className="bg-primary-light rounded-2xl p-4">
                                            <Text className="text-white text-lg font-pbold mb-4">How to Perform</Text>
                                            <View className="space-y-3">
                                                {activeExercise?.exercise_instructions.split('\n').map((step, index) => (
                                                    <View key={index} className="flex-row mb-3">
                                                        <View className="bg-accent/20 rounded-full w-6 h-6 items-center justify-center mr-3">
                                                            <Text className="text-accent font-pbold text-xs">{index + 1}</Text>
                                                        </View>
                                                        <Text className="text-gray-300 font-pmedium text-sm flex-1 leading-6">
                                                            {step.trim()}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}
                </SafeAreaView>
            </MenuProvider>
        </Modal>
    )
}

export default ExerciseListPopup;
