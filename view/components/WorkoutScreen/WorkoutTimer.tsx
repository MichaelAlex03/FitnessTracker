import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTimerContext from '@/hooks/useTimerContext';


interface TimerProps {
    showWorkout: boolean,
}

const WorkoutTimer = ({ showWorkout }: TimerProps) => {

    const { elapsedTime, setElapsedTime } = useTimerContext()

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (showWorkout) {
            intervalId = setInterval(() => {
                setElapsedTime(elapsedTime + 1);
            }, 1000)
        }

        return () => {
            clearInterval(intervalId);
        }

    }, [showWorkout])

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