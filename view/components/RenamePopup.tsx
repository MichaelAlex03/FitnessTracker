import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native'


interface PopupScreenProps {
    showRename: boolean,
    setShowRename: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number
}

const RenamePopup = ({ showRename, setShowRename, workoutId }: PopupScreenProps) => {

    const [workoutName, setWorkoutName] = useState('');

    const handleUpdateWorkoutName = () => {

    }

    return (
        <Modal
            visible={showRename}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowRename(false)}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-6">
                <View className='bg-primary w-full p-6 rounded-3xl'>
                    <Text className='text-white text-2xl font-bold mb-4 text-center'>Rename Workout</Text>

                    <View className='border border-gray-600 w-full h-16 px-4 bg-black/20 rounded-2xl flex flex-row items-center mt-1 mb-6'>
                        <TextInput
                            value={workoutName}
                            onChangeText={(e) => setWorkoutName(e)}
                            placeholder="Enter workout name"
                            placeholderTextColor="#94a3b8"
                            className="text-white w-full"
                        />
                    </View>
                   

                    <View className='flex gap-5 mt-2'>


                        <TouchableOpacity
                            onPress={() => setShowRename(false)}
                            className='bg-secondary py-4 rounded-2xl'
                        >
                            <Text className='text-white text-center font-bold'>Close</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default RenamePopup