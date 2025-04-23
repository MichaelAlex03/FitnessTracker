import React from 'react'
import { TouchableOpacity, View, Text, Modal } from 'react-native'

interface EditWorkoutProps {
    editWorkout: boolean,
    setEditWorkout: React.Dispatch<React.SetStateAction<boolean>>,
    workoutId: number,
    setActiveWorkout: React.Dispatch<React.SetStateAction<number>>,
    refresh: number,
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
}

const EditWorkout = ({editWorkout, setEditWorkout, workoutId, setActiveWorkout, refresh, setRefresh}: EditWorkoutProps) => {

    const handleUpdateWorkout = async () => {
        
    }

    return (
        <Modal
            visible={editWorkout}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
                setEditWorkout(false)
                setActiveWorkout(0)
            }}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <Text>Test</Text>
                <TouchableOpacity onPress={() => {
                    setEditWorkout(false)
                    setActiveWorkout(0)
                }}>
                    <Text className='text-white'>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default EditWorkout