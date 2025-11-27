import { View, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import AddExercise from '@/components/AddExercise';

const EXERCISES_URL = '/api/exercises'

interface Exercise {
  exercise_name: string,
  exercise_category: string,
  exercise_instructions: string,
  id: string
}

interface ExerciseItem {
  item: Exercise
}

type bodyPartToFilterMap = Map<string, number>

interface BodyParts {
  id: number
  value: string
}


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

  const [searchData, setSearchData] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [bodyParts, setBodyParts] = useState<bodyPartToFilterMap>(new Map());
  const [showBodyPartFilter, setShowBodyPartFilter] = useState<boolean>(false);


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
                  {item.exercise_category}
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


  const renderFilterItems = ({ item }: { item: BodyParts }) => {
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


  const fetchExercises = async () => {
    try {
      const response = await axiosPrivate.get(EXERCISES_URL);
      setExercises(response.data.exercises);
      setFilteredExercises(response.data.exercises)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddExercise = async (exercise: { exercise_name: string; exercise_category: string; exercise_instructions: string }) => {
    try {
      const response = await axiosPrivate.post(EXERCISES_URL, exercise);
      if (response.status === 201) {
        await fetchExercises();
        setAddModalVisible(false);
      }
    } catch (error) {
      console.error('Failed to add exercise:', error);
    }
  }


  const filterByBodyPart = () => {

    if (bodyParts.size === 0){
      setFilteredExercises(exercises)
      setShowBodyPartFilter(false)
      return;
    }

    const filtered = exercises.filter(exercise =>
      bodyParts.get(exercise.exercise_category) !== undefined
    )
    setFilteredExercises(filtered)
    setShowBodyPartFilter(false)
  }

  useEffect(() => {
    fetchExercises();
  }, [])

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
                    <AntDesign name="reload1" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Body Part</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={() => setFilteredExercises(exercises)}
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#6366F120' }}>
                    <AntDesign name="reload1" size={14} color="#6366F1" />
                  </View>
                  <Text className="text-white text-base font-pmedium">Category</Text>
                </MenuOption>
                <View style={{ height: 1, backgroundColor: '#374151', marginHorizontal: 8 }} />
                <MenuOption
                  onSelect={() => setFilteredExercises(exercises)}
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
                          {activeExercise?.exercise_category}
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
            <View className="flex-1 bg-black/80 justify-center items-center p-6">

              <View className='bg-primary items-center justify-center w-full rounded-xl p-6'>
                <FlatList
                  data={BODY_PARTS}
                  renderItem={renderFilterItems}
                  keyExtractor={item => item.id.toString()}
                  ListFooterComponent={() => (
                    <View className='w-full gap-4 mt-4'>
                      <TouchableOpacity
                        onPress={filterByBodyPart}
                        className='bg-gray-700 py-4 rounded-2xl active:bg-gray-600'
                      >
                        <Text className='text-white text-center font-pbold text-lg'>Confirm Filter</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setShowBodyPartFilter(false)}
                        className='bg-accent rounded-2xl py-4 shadow-lg shadow-accent/40 active:scale-95'
                      >
                        <Text className='text-white text-center font-pbold text-lg'>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
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