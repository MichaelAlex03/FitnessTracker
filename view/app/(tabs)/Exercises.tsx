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


  //Exercise item to render
  const renderExercise = ({ item }: ExerciseItem) => {
    return (
      <TouchableOpacity
        className="bg-black-100 mx-4 mb-4 rounded-2xl p-4 border border-black-200 active:opacity-80"
        onPress={() => {
          setActiveExercise(item);
          setModalVisible(true);
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-lg font-pmedium mb-1">
              {item.exercise_name}
            </Text>
            <Text className="text-gray-100 text-sm">
              {item.exercise_category}
            </Text>
          </View>

          <View className="bg-secondary/20 p-2 rounded-xl">
            <AntDesign
              name="right"
              size={20}
              color="#FF9C01" // Your secondary color
            />
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
      <View className='flex flex-row w-full items-center p-4'>
        <View className='border rounded-2xl border-black-200 h-12 flex justify-center px-4 flex-1 mr-8'>
          <TextInput
            className='text-white'
            value={searchData}
            onChangeText={(val) => setSearchData(val)}
          />
        </View>
        <AntDesign name="search1" size={24} color="white" />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={item => item.id}
      />
      {
        modalVisible && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >

            <View className="flex-1 bg-black/50 justify-center items-center">

              {/*Modal Content*/}
              <View className="bg-black-100 w-[90%] rounded-2xl p-6 mx-4">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white text-xl font-pmedium">
                    {activeExercise?.exercise_name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="p-2"
                  >
                    <AntDesign name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <Text className="text-white text-lg font-pmedium mb-2">Instructions</Text>
                <Text className="text-gray-100">
                  {activeExercise?.exercise_instructions.split('\n').map((step, index) => (
                    <View key={index} className="flex-row">
                      <Text className="text-secondary font-pmedium mr-2">
                        {index + 1}.
                      </Text>
                      <Text className="text-gray-100 flex-1">
                        {step.trim()}
                      </Text>
                    </View>
                  ))}
                </Text>
              </View>
            </View>
          </Modal>
        )
      }
    </SafeAreaView>
  )
}

export default Exercises