import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface Set {
    id: string
    exercise_id: number
    exercise_reps: number
    workout_id: number
    exercise_weight: number
    set_type: string
    user_id: string
}

const RenderHistorySets = (sets: Set[]) => {
    return (
        <View>
            <Text>RenderHistorySets</Text>
        </View>
    )
}

export default RenderHistorySets
