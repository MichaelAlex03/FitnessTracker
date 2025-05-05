import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTimerContext from '@/hooks/useTimerContext';
import { useSharedValue } from 'react-native-reanimated';


interface TimerProps {
    showWorkout: boolean,
}

const WorkoutTimer = ({ showWorkout }: TimerProps) => {

    let { elapsedTime, setElapsedTime } = useTimerContext()

    const timePassed = useSharedValue(elapsedTime)

    useEffect(() => {
        let intervalId: NodeJS.Timeout;


        intervalId = setInterval(() => {
            elapsedTime += 1
            setElapsedTime(elapsedTime);
        }, 1000)


        return () => {
            clearInterval(intervalId);
            setElapsedTime(0);
        }

    }, [])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View className='flex flex-row items-center gap-2'>
            <Icon name="timer" size={20} color="#FF9C01" />
            <Text className='text-secondary font-semibold text-lg'>{formatTime(elapsedTime)}</Text>
        </View>
    )
}

export default WorkoutTimer