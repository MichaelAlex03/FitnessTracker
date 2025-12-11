import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import AddExercise from '@/components/ExerciseScreen/AddExercise';
import useAuth from '@/hooks/useAuth';
import EditExercise from '@/components/ExerciseScreen/EditExercise';
import DeleteExercisePopup from '@/components/ExerciseScreen/DeleteExercisePopup';

const EXERCISES_URL = '/api/exercises'

interface Exercise {
  exercise_name: string,
  exercise_bodypart: string,
  exercise_instructions: string,
  exercise_category: string,
  user_id: string
  id: number
}

interface ExerciseItem {
  item: Exercise
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

const Exercises = () => {

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const [searchData, setSearchData] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<number>(0);

  const [bodyParts, setBodyParts] = useState<bodyPartToFilterMap>(new Map());
  const [bodyPartsSelected, setBodyPartsSelected] = useState<bodyPartToFilterMap>(new Map());
  const [showBodyPartFilter, setShowBodyPartFilter] = useState<boolean>(false);

  const [categories, setCategories] = useState<categoryToFilterMap>(new Map())
  const [categoriesSelected, setCategoriesSelected] = useState<categoryToFilterMap>(new Map())
  const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);

  const [showMyExercisesOnly, setShowMyExercisesOnly] = useState<boolean>(false);

  const [editExerciseModal, setEditExerciseModal] = useState<boolean>(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<number>(0);

  const [deleteExercisePopup, setDeleteExercisePopup] = useState<boolean>(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number>(0);

  const deleteExercise = async (exercise_id: number) => {
    try {
      const response = await axiosPrivate.delete(`/api/exercises/exercise/${exercise_id}`)
      if (response.status === 200) {
        Alert.alert("Exercise Deleted", "The exercise has been deleted");
        setDeleteExercisePopup(false)
        setRefresh(refresh + 1)
        setExerciseToDelete(0)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const updateExercise = async (exercise: Exercise) => {
    try {
      const response = await axiosPrivate.patch(`/api/exercises/exercise/${exerciseToEdit}`, {
        exercise
      })
      if (response.status === 200) {
        Alert.alert("Exercise updated", "You have succesfully updated the exercise");
        setEditExerciseModal(false)
        setRefresh(refresh + 1)
        setExerciseToEdit(0)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const renderExercise = ({ item }: ExerciseItem) => {
    const isUserCreated = item.user_id === auth.userId;

    return (
      <View className="bg-surface mx-4 mb-3 rounded-2xl p-4 border-2 border-gray-700">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-1"
            onPress={() => {
              setActiveExercise(item);
              setModalVisible(true);
            }}
          >
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
              <View className="rounded-full px-3 py-1" style={{ backgroundColor: '#6366F120' }}>
                <Text className="text-xs font-pmedium" style={{ color: '#6366F1' }}>
                  {item.exercise_bodypart}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {isUserCreated ? (
            <Menu>
              <MenuTrigger>
                <View className="bg-accent/20 p-3 rounded-xl">
                  <AntDesign name="ellipsis" size={18} color="#6366F1" />
                </View>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  backgroundColor: '#1F2937',
                  borderRadius: 16,
                  padding: 4,
                  marginTop: 8,
                  borderWidth: 1,
                  borderColor: '#374151',
                }}
              >
                <MenuOption
                  onSelect={() => {
                    setActiveExercise(item);
                    setModalVisible(true);
                  }}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                    <AntDesign name="eye" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">View Instructions</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={() => {
                    setEditExerciseModal(true)
                    setExerciseToEdit(item.id)
                  }}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#F59E0B20' }}>
                    <AntDesign name="edit" size={14} color="#F59E0B" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Edit</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={() => {
                    setDeleteExercisePopup(true)
                    setExerciseToDelete(item.id)
                  }}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#EF444420' }}>
                    <AntDesign name="delete" size={14} color="#EF4444" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setActiveExercise(item);
                setModalVisible(true);
              }}
            >
              <View className="bg-accent/20 p-3 rounded-xl">
                <AntDesign name="right" size={18} color="#6366F1" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
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


  const fetchExercises = async () => {
    try {
      const response = await axiosPrivate.get(`${EXERCISES_URL}/${auth.userId}`);
      setExercises(response.data.exercises);
      setFilteredExercises(response.data.exercises)
    } catch (error) {
      console.error(error)
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


  const filterByBodyPart = () => {
    setBodyParts(bodyPartsSelected)
    setShowBodyPartFilter(false);
  }


  const filterByCategory = () => {
    setCategories(categoriesSelected)
    setShowCategoryFilter(false);
  }


  const resetFilter = () => {
    clearAllFilters();
  }

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
    setFilteredExercises(exercises);
    setBodyPartsSelected(new Map())
    setCategoriesSelected(new Map())
  };

  useEffect(() => {
    fetchExercises();
  }, [refresh])

  useEffect(() => {
    applyAllFilters()
  }, [bodyParts, categories, showMyExercisesOnly, exercises, searchData])


  return (
    <SafeAreaView className='bg-primary flex-1' edges={['top', 'left', 'right']}>
      <View className='px-5 pt-6 pb-4'>
        <Text className='text-white font-pextrabold text-4xl mb-2'>Exercise Library</Text>

        <View className='flex flex-row justify-between items-center'>
          <Text className='text-gray-400 font-pmedium text-base'>{filteredExercises.length} exercises available</Text>
          <View className='flex-row gap-2'>
            <TouchableOpacity
              className='bg-surface border-2 border-gray-700 rounded-xl p-3 items-center justify-center'
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
                    borderRadius: 12,
                    padding: 10,
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
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />

              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>

      <View className='px-5 mb-8'>
        <View className='bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
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
        renderItem={renderExercise}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {
        modalVisible && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
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
                      <View className="rounded-full px-3 py-1 self-start" style={{ backgroundColor: `'#6366F1'20` }}>
                        <Text className="text-sm font-pmedium" style={{ color: '#6366F1' }}>
                          {activeExercise?.exercise_bodypart}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
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
                          <View className="bg-accent rounded-full w-6 h-6 items-center justify-center mr-3">
                            <Text className="text-white font-pbold text-xs">
                              {index + 1}
                            </Text>
                          </View>
                          <Text className="text-gray-300 flex-1 font-pmedium leading-6">
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
        )
      }
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
                        setBodyPartsSelected(new Map());
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
                        setCategoriesSelected(new Map());
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

      <EditExercise
        visible={editExerciseModal}
        onClose={() => setEditExerciseModal(false)}
        onSubmit={updateExercise}
        exercise_id={exerciseToEdit}
      />

      <DeleteExercisePopup
        visible={deleteExercisePopup}
        exercise_id={exerciseToDelete}
        setVisible={setDeleteExercisePopup}
        onSubmit={deleteExercise}
      />
    </SafeAreaView>
  )
}

export default Exercises