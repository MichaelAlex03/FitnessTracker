import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import SetTypeInfo from '../SetTypeModal/SetTypeInfo';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

interface Set {
    id: string,
    exercise_id: number,
    exercise_reps: number,
    workout_id: number,
    exercise_weight: number,
    set_type: string
}

interface HistorySet {
    id: string
    exercise_id: number
    exercise_reps: number
    workout_id: number
    exercise_weight: number
    set_type: string
    user_id: string
    exercise_name: string
}

interface SetProps {
    set: Set;
    index: number;
    handleRemoveSet: (id: String) => void;
    handleRepChange?: (set: Set, reps: number) => void
    handleWeightChange?: (set: Set, weight: number) => void
    handleSetTypeChange: (id: string, type: string) => void,
    editWorkout?: boolean,
    prevSet: HistorySet
}


const RenderSet = ({
    set,
    index,
    handleRemoveSet,
    handleRepChange,
    handleWeightChange,
    handleSetTypeChange,
    editWorkout,
    prevSet
}: SetProps) => {

    const [showSetTypeInfo, setShowSetTypeInfo] = useState(false);
    const [setTypeInfo, setSetTypeInfo] = useState('');

    console.log("HEREEE", prevSet)

    return (
        <View className='flex flex-row items-center gap-4 py-2'>
            <View className='items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Sets</Text>}
                <Menu>
                    <MenuTrigger>
                        <View className='items-center justify-center'>
                            {set.set_type === 'default' && <Text className='text-white font-semibold text-lg bg-secondary/20 px-4 py-1 rounded-lg'>{index + 1}</Text>}
                            {set.set_type === 'warmup' && <View className="bg-blue-500/30 w-8 h-8 rounded-lg items-center justify-center">
                                <Text className="text-blue-500  font-bold">W</Text>
                            </View>}
                            {set.set_type === 'drop' && <View className="bg-purple-500/30 w-8 h-8 rounded-lg items-center justify-center">
                                <Text className="text-purple-500 font-bold">D</Text>
                            </View>}
                            {set.set_type === 'failure' && <View className="bg-red-500/30 w-8 h-8 rounded-lg items-center justify-center">
                                <Text className="text-red-500 font-bold">F</Text>
                            </View>}
                        </View>
                    </MenuTrigger>
                    <MenuOptions
                        optionsContainerStyle={{
                            backgroundColor: '#1E1E1E',
                            borderRadius: 8,
                            marginTop: 40,
                        }}
                    >
                        <MenuOption
                            style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                            onSelect={() => {
                                handleSetTypeChange(set.id, 'warmup');
                            }}
                        >
                            <View className="bg-blue-500/30 w-8 h-8 rounded-full items-center justify-center">
                                <Text className="text-blue-500 font-bold">W</Text>
                            </View>
                            <Text className="text-white text-base font-semibold">Warmup Set</Text>
                            <TouchableOpacity className='bg-secondary/20 p-1 rounded-full ml-auto' onPress={() => {
                                setShowSetTypeInfo(true);
                                setSetTypeInfo('warmup');
                            }}>
                                <AntDesign
                                    name="question"
                                    size={20}
                                    color="#FF9C01"
                                />
                            </TouchableOpacity>
                        </MenuOption>
                        <MenuOption
                            style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                            onSelect={() => {
                                handleSetTypeChange(set.id, 'drop');
                            }}
                        >
                            <View className="bg-purple-500/30 w-8 h-8 rounded-full items-center justify-center">
                                <Text className="text-purple-500 font-bold">D</Text>
                            </View>
                            <Text className="text-white text-base font-semibold">Drop Set</Text>
                            <TouchableOpacity className='bg-secondary/20 p-1 rounded-full ml-auto' onPress={() => {
                                setShowSetTypeInfo(true);
                                setSetTypeInfo('drop');
                            }}>
                                <AntDesign
                                    name="question"
                                    size={20}
                                    color="#FF9C01"
                                />
                            </TouchableOpacity>
                        </MenuOption>
                        <MenuOption
                            style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                            onSelect={() => {
                                handleSetTypeChange(set.id, 'failure');
                            }}
                        >
                            <View className="bg-red-500/30 w-8 h-8 rounded-full items-center justify-center">
                                <Text className="text-red-500 font-bold">F</Text>
                            </View>
                            <Text className="text-white text-base font-semibold">Failure Set</Text>

                            <TouchableOpacity className='bg-secondary/20 p-1 rounded-full ml-auto' onPress={() => {
                                setShowSetTypeInfo(true);
                                setSetTypeInfo('failure');
                            }}>
                                <AntDesign
                                    name="question"
                                    size={20}
                                    color="#FF9C01"
                                />
                            </TouchableOpacity>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
                <SetTypeInfo
                    showSetTypeInfo={showSetTypeInfo}
                    setShowSetTypeInfo={setShowSetTypeInfo}
                    setType={setTypeInfo}
                />
            </View>

            <View className='flex-1 items-center gap-4 justify-center w-16'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Prev</Text>}
                <Text className={`text-white font-semibold py-1 ${set.exercise_reps >= 100 || set.exercise_weight >= 100 ? 'text-xs' : 'text-md'}`}>
                    {
                        prevSet.exercise_reps && prevSet.exercise_weight ? (
                            `${prevSet.exercise_reps} lb x ${prevSet.exercise_weight}`
                        ) : (
                            <AntDesign name="minus" size={20} color="white" />
                        )
                    }
                </Text>
            </View>
            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Reps</Text>}
                <TextInput
                    className='text-white font-semibold text-lg px-2 py-1 bg-secondary/20 rounded-lg w-16 text-center'
                    style={{
                        textAlignVertical: 'center',
                        paddingVertical: 0,
                        height: 30,
                        includeFontPadding: false
                    }}
                    onChangeText={(e) => handleRepChange?.(set, Number(e))}
                    maxLength={3}
                    keyboardType="numeric"
                    editable={!editWorkout}
                />
            </View>
            <View className='flex-1 items-center gap-4 justify-center'>
                {index === 0 && <Text className='text-white font-semibold text-lg'>Weight</Text>}
                <TextInput
                    className='text-white font-semibold text-lg px-2 py-1 bg-secondary/20 rounded-lg w-16 text-center'
                    style={{
                        textAlignVertical: 'center',
                        paddingVertical: 0,
                        height: 30,
                        includeFontPadding: false
                    }}
                    onChangeText={(e) => handleWeightChange?.(set, Number(e))}
                    maxLength={4}
                    keyboardType="numeric"
                    editable={!editWorkout}
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