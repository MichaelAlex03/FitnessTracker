import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';

interface Sets {
    id: string,
    exercise_id: number,
    exercise_reps: number,
    workout_id: number,
    exercise_weight: number,
}

interface SetProps {
    set: Sets;
    index: number;
    handleRemoveSet: (id: String) => void;
    handleRepChange: (set: Sets, reps: number) => void
    handleWeightChange: (set: Sets, weight: number) => void
}

const RenderSet = ({ set, index, handleRemoveSet, handleRepChange, handleWeightChange }: SetProps) => {


    const [regularSet, setRegularSet] = useState(true);
    const [warmUpSet, setWarmUpSet] = useState(false);
    const [dropSet, setDropSet] = useState(false);
    const [failureSet, setFailureSet] = useState(false);

    const handleWarmUpSet = () => {
        setWarmUpSet(true);
        setRegularSet(false);
        setFailureSet(false);
        setDropSet(false);
    }

    const handleDropSet = () => {
        setWarmUpSet(false);
        setRegularSet(false);
        setFailureSet(false);
        setDropSet(true);
    }

    const handleFailureSet = () => {
        setWarmUpSet(false);
        setRegularSet(false);
        setFailureSet(true);
        setDropSet(false);
    }

    return (
        <View className='flex flex-row items-center gap-8 py-2'>
            <Menu>
                <MenuTrigger>
                    <View className='items-center gap-4 justify-center'>
                        {index === 0 && <Text className='text-white font-semibold text-lg'>Sets</Text>}
                        { regularSet && <Text className='text-white font-semibold text-lg bg-secondary/20 px-4 py-1 rounded-lg'>{index + 1}</Text> }
                    </View>
                </MenuTrigger>
                <MenuOptions
                    optionsContainerStyle={{
                        backgroundColor: '#1E1E1E',
                        borderRadius: 8,
                        marginTop: 80,
                    }}
                >
                    <MenuOption
                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                        <View className="bg-blue-500/30 w-8 h-8 rounded-full items-center justify-center">
                            <Text className="text-blue-500 font-bold">W</Text>
                        </View>
                        <Text className="text-white text-base font-semibold">Warmup Set</Text>
                    </MenuOption>
                    <MenuOption
                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                        <View className="bg-purple-500/30 w-8 h-8 rounded-full items-center justify-center">
                            <Text className="text-purple-500 font-bold">D</Text>
                        </View>
                        <Text className="text-white text-base font-semibold">Drop Set</Text>
                    </MenuOption>
                    <MenuOption
                        style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                        <View className="bg-red-500/30 w-8 h-8 rounded-full items-center justify-center">
                            <Text className="text-red-500 font-bold">F</Text>
                        </View>
                        <Text className="text-white text-base font-semibold">Failure Set</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>

            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Prev</Text>}
                <Text className='text-white font-semibold text-lg px-4 py-1'>
                    <AntDesign name="minus" size={20} color="white" />
                </Text>
            </View>
            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Reps</Text>}
                <TextInput
                    className='text-white font-semibold text-lg px-6 py-1 bg-secondary/20 rounded-lg'
                    onChangeText={(e) => handleRepChange(set, Number(e))}
                />
            </View>
            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Weight</Text>}
                <TextInput
                    className='text-white font-semibold text-lg px-6 py-1 bg-secondary/20 rounded-lg '
                    onChangeText={(e) => handleWeightChange(set, Number(e))}
                />
            </View>
            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Delete</Text>}
                <TouchableOpacity
                    onPress={() => handleRemoveSet(set.id)}
                    className="bg-gray-500 px-3 py-1.5 rounded-lg"
                >
                    <AntDesign name="minus" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default RenderSet;