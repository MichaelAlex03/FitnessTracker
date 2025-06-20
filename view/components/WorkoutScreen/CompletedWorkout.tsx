import React from 'react'
import { View, Text, Modal } from 'react-native'

interface Exercise {
  id: number,
  exercise_name: string,
  workout_id: string
}


interface Sets {
  id: string,
  exercise_id: number,
  exercise_reps: number,
  workout_id: number,
  exercise_weight: number,
  set_type: string
}

interface CompletedWorkoutProps {
  exercises: Exercise[]
  sets: Sets[]
  workoutName: string
  workoutTimer: string
}


const CompletedWorkout = ({ exercises, sets, workoutName, workoutTimer }: CompletedWorkoutProps) => {
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType='slide'
    >
      <View>
        <Text>Completed Workout</Text>
      </View>
    </Modal>
  )
}

export default CompletedWorkout