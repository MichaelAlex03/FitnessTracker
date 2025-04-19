import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';

const WORKOUT_URL = '/api/workouts';

interface PopupScreenProps {
    showRename: boolean,
    setShowRename: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number,
    refresh: number,
    setRefresh: React.Dispatch<React.SetStateAction<number>>
}

const RenamePopup = ({ showRename, setShowRename, workoutId, refresh, setRefresh }: PopupScreenProps) => {

    const [workoutName, setWorkoutName] = useState('');
    const axiosPrivate = useAxiosPrivate()

    const handleUpdateWorkoutName = async () => {

        try {
            await axiosPrivate.patch(`${WORKOUT_URL}/${workoutId}`, {
                workoutName
            });

            setShowRename(false);
            setRefresh(refresh + 1)
        } catch (error) {
            console.error(error)
        }

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
                            onPress={handleUpdateWorkoutName}
                            className='bg-secondary py-4 rounded-2xl'
                        >
                            <Text className='text-white text-center font-bold'>Update Name</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowRename(false)}
                            className='bg-[#25344d] py-4 rounded-2xl'
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