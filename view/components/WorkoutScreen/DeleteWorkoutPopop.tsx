import { View, Text, Modal, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'


interface DeleteWorkoutProps {
    workout_id: number;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (exerciseId: number) => void
}

const DeleteWorkoutPopup = ({ workout_id, visible, onSubmit, setVisible }: DeleteWorkoutProps) => {

    const handleDelete = () => {
        onSubmit(workout_id)
    }

    return (
        <Modal
            animationType='slide'
            visible={visible}
            onRequestClose={() => setVisible(false)}
            transparent={true}
        >
            <View className='flex-1 bg-black/80 p-6 items-center justify-center'>
                <View className='bg-primary p-4 w-full rounded-xl'>

                    <View className='w-full items-start gap-6'>
                        <Text className='text-white font-bold text-2xl'>Delete Workout</Text>
                        <Text className='text-white font-semibold text-base'>Are you sure you want to delete the workout?</Text>
                    </View>

                    <View className='w-full flex flex-row justify-end gap-4 mt-6'>
                        <TouchableOpacity
                            className="flex-1 bg-accent/20 rounded-xl py-3.5 border-2 border-gray-700"
                            onPress={handleDelete}
                        >
                            <Text className='text-white text-center'>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            className="flex-1 bg-accent rounded-xl py-3.5"
                        >
                            <Text className='text-white text-center'>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteWorkoutPopup