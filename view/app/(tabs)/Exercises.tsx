import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import AddExercise from '@/components/AddExercise';
import useAuth from '@/hooks/useAuth';
import { GenerateUUID } from 'react-native-uuid';

const EXERCISES_URL = '/api/exercises'

interface Exercise {
  exercise_name: string,
  exercise_bodypart: string,
  exercise_instructions: string,
  exercise_category: string,
  user_id: string
  id: string
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
  const [showBodyPartFilter, setShowBodyPartFilter] = useState<boolean>(false);

  const [categories, setCategories] = useState<categoryToFilterMap>(new Map())
  const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);


  const renderExercise = ({ item }: ExerciseItem) => {

    return (
      <TouchableOpacity
        className="bg-surface mx-4 mb-3 rounded-2xl p-4 border-2 border-gray-700 active:border-accent active:scale-[0.98]"
        onPress={() => {
          setActiveExercise(item);
          setModalVisible(true);
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-lg font-pbold mb-2">
              {item.exercise_name}
            </Text>
            <View className="flex-row items-center">
              <View className="rounded-full px-3 py-1" style={{ backgroundColor: '#6366F120' }}>
                <Text className="text-xs font-pmedium" style={{ color: '#6366F1' }}>
                  {item.exercise_bodypart}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-accent/20 p-3 rounded-xl">
            <AntDesign name="right" size={18} color="#6366F1" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  const renderBodyPartFilter = ({ item }: { item: BodyParts }) => {
    let name = item.value
    const isSelected = bodyParts.get(name) !== undefined;

    const toggleBodyPart = () => {
      const newMap = new Map(bodyParts);
      if (isSelected) {
        newMap.delete(name);
      } else {
        newMap.set(name, 1);
      }
      setBodyParts(newMap);
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
    let isSelected = categories.get(category) !== undefined

    const toggleCategory = () => {
      const newMap = new Map(categories)
      if (isSelected) {
        newMap.delete(category)
      } else {
        newMap.set(category, 1)
      }

      setCategories(newMap)
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

    if (bodyParts.size === 0) {
      setFilteredExercises(exercises)
      setShowBodyPartFilter(false)
      return;
    }

    const filtered = exercises.filter(exercise =>
      bodyParts.get(exercise.exercise_bodypart) !== undefined
    )
    setFilteredExercises(filtered)
    setShowBodyPartFilter(false)
    setCategories(new Map())
  }

  const filterByCategory = () => {
    if (categories.size === 0) {
      setFilteredExercises(exercises)
      setShowCategoryFilter(false)
      return;
    }

    const filtered = exercises.filter(exercise =>
      categories.get(exercise.exercise_category) !== undefined
    )

    setFilteredExercises(filtered)
    setShowCategoryFilter(false);
    setBodyParts(new Map())
  }

  const filterUserWorkouts = () => {
    const filtered = exercises.filter(exercise => (
      exercise.user_id === auth.userId
    ))
    setFilteredExercises(filtered)
  }

  const resetFilter = () => {
    setFilteredExercises(exercises)
    setBodyParts(new Map())
    setCategories(new Map())
  }

  useEffect(() => {
    fetchExercises();
  }, [refresh])

  useEffect(() => {
    if (searchData.trim() === '') {
      setFilteredExercises(exercises); //If search is empty show all exercises
    }

    const filtered = exercises.filter(exercise =>
      exercise.exercise_name.toLowerCase().startsWith(searchData.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchData])


  return (
    <SafeAreaView className='bg-primary flex-1'>
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
                    <AntDesign name="appstore-o" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Category</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={filterUserWorkouts}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                    <AntDesign name="reload1" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">My Exercises</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={resetFilter}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                    <AntDesign name="reload1" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Reset Filter</Text>
                </MenuOption>

              </MenuOptions>
            </Menu>
          </View>
        </View>
      </View>

      <View className='px-5 mb-8'>
        <View className='bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
          <AntDesign name="search1" size={20} color="#6B7280" />
          <TextInput
            className='text-white flex-1 ml-3 font-pmedium text-base'
            value={searchData}
            onChangeText={(val) => setSearchData(val)}
            placeholder="Search exercises..."
            placeholderTextColor='#6B7280'
          />
          {searchData.length > 0 && (
            <TouchableOpacity onPress={() => setSearchData('')}>
              <AntDesign name="closecircle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={item => item.id}
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
            onRequestClose={() => setShowBodyPartFilter(false)}
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
                      {bodyParts.size > 0 ? `${bodyParts.size} selected` : 'Select one or more'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowBodyPartFilter(false)}
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
                        setBodyParts(new Map());
                        setFilteredExercises(exercises);
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
            onRequestClose={() => setShowCategoryFilter(false)}
          >
            <View className="flex-1 bg-black/80 justify-end">
              <View className="bg-surface rounded-t-3xl border-t-2 border-accent/30">

                {/* Drag Handle */}
                <View className="items-center py-3">
                  <View className="w-12 h-1 bg-gray-600 rounded-full" />
                </View>

                {/* Header */}
                <View className="flex-row justify-between items-center px-6 pb-4">
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-pbold mb-1">Filter by Category</Text>
                    <Text className="text-gray-400 font-pmedium text-sm">
                      {categories.size > 0 ? `${categories.size} selected` : 'Select one or more'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowCategoryFilter(false)}
                    className="bg-gray-700 p-2 rounded-xl"
                  >
                    <AntDesign name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Categories List */}
                <View className="max-h-96">
                  <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategoryItems}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 16 }}
                  />
                </View>

                {/* Action Buttons */}
                <View className="px-6 pb-8 pt-4 border-t border-gray-700">
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => {
                        setCategories(new Map());
                        setFilteredExercises(exercises);
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
  )
}

export default Exercises