import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const EXERCISES_URL = '/api/exercises'

const Exercises = () => {

  const axiosPrivate = useAxiosPrivate();

  const [searchData, setSearchData] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  //Exercise item to render
  const renderExercise = ({ item }) => {
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
              Compound Exercise • Full Body
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
    if (searchData.trim() === ''){
      setFilteredExercises(exercises); //If search is empty show all exercises
    }

    //if search does exist set filtered exercises to exercises that includes the current search data
    const filtered = exercises.filter(exercise => 
      exercise.exercise_name.toLowerCase().startsWith(searchData.toLowerCase())
    );
    setFilteredExercises(filtered);
  },[searchData])

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
    </SafeAreaView>
  )
}

export default Exercises