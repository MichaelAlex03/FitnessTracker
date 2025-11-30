import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'

interface AddExerciseProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (exercise: {
    exercise_name: string,
    exercise_bodypart: string,
    exercise_category: string,
    exercise_instructions: string
  }) => void;
}

const BODY_PARTS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const CATEGORIES = ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Other']

const AddExercise = ({ visible, onClose, onSubmit }: AddExerciseProps) => {
  const [exerciseName, setExerciseName] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barbell')
  const [instructions, setInstructions] = useState('');

  const handleSubmit = () => {
    if (!exerciseName.trim() || !instructions.trim()) {
      Alert.alert("Empty Fields", "Please fill in all fields to add exercise")
      return;
    }

    onSubmit({
      exercise_name: exerciseName,
      exercise_bodypart: selectedBodyPart,
      exercise_category: selectedCategory,
      exercise_instructions: instructions
    });


    setExerciseName('');
    setSelectedBodyPart('Chest');
    setInstructions('');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-4">
        <View className="bg-surface rounded-3xl border-2 border-accent/30 w-full max-w-lg">

          <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
            <Text className="text-white text-2xl font-pbold">Add Exercise</Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-700 p-2 rounded-xl"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6 pb-6" showsVerticalScrollIndicator={false}>
            <View className="mb-5">
              <Text className="text-white text-base font-pmedium mb-2">Exercise Name</Text>
              <TextInput
                className="bg-primary border-2 border-gray-700 rounded-xl px-4 py-3 text-white font-pmedium text-base"
                value={exerciseName}
                onChangeText={setExerciseName}
                placeholder="e.g., Barbell Bench Press"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View className="mb-5">
              <Text className="text-white text-base font-pmedium mb-2">Body Part</Text>
              <View className="flex-row flex-wrap gap-2">
                {BODY_PARTS.map((part) => (
                  <TouchableOpacity
                    key={part}
                    onPress={() => setSelectedBodyPart(part)}
                    className={`px-4 py-2 rounded-xl border-2 ${selectedBodyPart === part
                      ? 'bg-accent/20 border-accent'
                      : 'bg-primary border-gray-700'
                      }`}
                  >
                    <Text
                      className={`font-pmedium ${selectedBodyPart === part ? 'text-accent' : 'text-gray-400'
                        }`}
                    >
                      {part}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-white text-base font-pmedium mb-2">Body Part</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl border-2 ${selectedCategory === category
                      ? 'bg-accent/20 border-accent'
                      : 'bg-primary border-gray-700'
                      }`}
                  >
                    <Text
                      className={`font-pmedium ${selectedCategory === category ? 'text-accent' : 'text-gray-400'
                        }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-white text-base font-pmedium mb-2">Instructions</Text>
              <Text className="text-gray-400 text-sm font-pregular mb-2">
                Enter each step on a new line
              </Text>
              <TextInput
                className="bg-primary border-2 border-gray-700 rounded-xl px-4 py-3 text-white font-pmedium text-base"
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Step 1: Setup position&#10;Step 2: Execute movement&#10;Step 3: Return to start"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                style={{ minHeight: 150 }}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-700 rounded-xl py-3.5 items-center"
              >
                <Text className="text-white font-psemibold text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-accent rounded-xl py-3.5 items-center"
              >
                <Text className="text-white font-psemibold text-base">Add Exercise</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddExercise;