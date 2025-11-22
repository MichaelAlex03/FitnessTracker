import { View, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

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

const Exercises = () => {

  const axiosPrivate = useAxiosPrivate();

  const [searchData, setSearchData] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Chest': '#6366F1',
      'Back': '#6366F1',
      'Shoulders': '#6366F1',
      'Arms': '#6366F1',
      'Legs': '#6366F1',
    };
    return colors[category] || '#6366F1';
  };

  //Exercise item to render
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
              <View className="rounded-full px-3 py-1" style={{ backgroundColor: `${getCategoryColor(item.exercise_category)}20` }}>
                <Text className="text-xs font-pmedium" style={{ color: getCategoryColor(item.exercise_category) }}>
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

  //Function to fetch exercises users can choose from
  const fetchExercises = async () => {
    try {
      const response = await axiosPrivate.get(EXERCISES_URL);
      setExercises(response.data.exercises);
      setFilteredExercises(response.data.exercises)
    } catch (error) {
      console.error(error)
    }
  }

  //On mount retrieve the exercises the users can select from
  useEffect(() => {
    fetchExercises();
  }, [])

  //useEffect handling search
  useEffect(() => {
    if (searchData.trim() === '') {
      setFilteredExercises(exercises); //If search is empty show all exercises
    }

    //if search does exist set filtered exercises to exercises that includes the current search data
    const filtered = exercises.filter(exercise =>
      exercise.exercise_name.toLowerCase().startsWith(searchData.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchData])

  console.log(exercises)

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <View className='px-5 pt-6 pb-4'>
        <Text className='text-white font-pextrabold text-4xl mb-2'>Exercise Library</Text>
        <Text className='text-gray-400 font-pmedium text-base'>{filteredExercises.length} exercises available</Text>
      </View>

      <View className='px-5 mb-4'>
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
                      <View className="rounded-full px-3 py-1 self-start" style={{ backgroundColor: `${getCategoryColor(activeExercise?.exercise_category || '')}20` }}>
                        <Text className="text-sm font-pmedium" style={{ color: getCategoryColor(activeExercise?.exercise_category || '') }}>
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
    </SafeAreaView>
  )
}

export default Exercises