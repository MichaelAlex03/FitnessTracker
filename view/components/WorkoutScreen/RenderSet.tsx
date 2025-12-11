import { View, Text, TouchableOpacity, TextInput, Animated, PanResponder } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import SetTypeInfo from '../SetTypeModal/SetTypeInfo';

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
    const [isCompleted, setIsCompleted] = useState(false);

    // Swipe animation values
    const pan = useRef(new Animated.Value(0)).current;
    const deleteOpacity = useRef(new Animated.Value(0)).current;

    // Pan responder for swipe gesture
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only activate if swiping horizontally more than vertically
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                // Only allow left swipe (negative values)
                if (gestureState.dx < 0) {
                    pan.setValue(gestureState.dx);
                    // Fade in delete indicator as user swipes
                    const opacity = Math.min(Math.abs(gestureState.dx) / 80, 1);
                    deleteOpacity.setValue(opacity);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -80) {
                    // Swipe threshold reached - delete the set
                    Animated.timing(pan, {
                        toValue: -300,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => handleRemoveSet(set.id));
                } else {
                    // Snap back to original position
                    Animated.parallel([
                        Animated.spring(pan, {
                            toValue: 0,
                            useNativeDriver: true,
                            friction: 8,
                        }),
                        Animated.timing(deleteOpacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start();
                }
            },
        })
    ).current;

    return (
        <View className='relative mb-2'>
            <Animated.View
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    opacity: deleteOpacity,
                }}
                className='bg-error rounded-xl justify-center items-center px-6 w-20'
            >
                <MaterialCommunityIcons name="trash-can" size={24} color="white" />
                <Text className='text-white font-pbold text-xs mt-1'>Delete</Text>
            </Animated.View>

            <Animated.View
                {...panResponder.panHandlers}
                style={{
                    transform: [{ translateX: pan }],
                }}
            >
                <View className={`${isCompleted ? 'bg-green-500/10' : 'bg-primary-light/80'} rounded-xl border border-gray-700/50`}>
                    <View className='flex flex-row items-center justify-evenly gap-1 px-3 py-3'>

                        <View className='items-center justify-center'>
                            {index === 0 && <Text className='text-gray-400 font-pmedium text-xs mb-2'>Set</Text>}
                            <Menu>
                                <MenuTrigger>
                                    <View className='items-center justify-center'>
                                        {set.set_type === 'default' &&
                                            <View className={`${isCompleted ? 'bg-transparent' : 'bg-accent/20 border border-accent/30'} w-10 h-10 rounded-lg items-center justify-center`}>
                                                <Text className={`${isCompleted ? 'text-white' : 'text-accent'} font-pbold text-base`}>{index + 1}</Text>
                                            </View>
                                        }
                                        {set.set_type === 'warmup' &&
                                            <View className={`${isCompleted ? 'bg-transparent' : 'bg-orange-500/20 border border-orange-500/40'} w-10 h-10 rounded-lg items-center justify-center`}>
                                                <Text className={`${isCompleted ? 'text-white' : 'text-orange-400'} font-pbold text-base`}>W</Text>
                                            </View>
                                        }
                                        {set.set_type === 'drop' &&
                                            <View className={`${isCompleted ? 'bg-transparent' : 'bg-purple-500/20 border border-purple-500/40'} w-10 h-10 rounded-lg items-center justify-center`}>
                                                <Text className={`${isCompleted ? 'text-white' : 'text-purple-400'} font-pbold text-base`}>D</Text>
                                            </View>
                                        }
                                        {set.set_type === 'failure' &&
                                            <View className={`${isCompleted ? 'bg-transparent' : 'bg-red-500/20 border-red-500/40'} w-10 h-10 rounded-lg items-center justify-center`}>
                                                <Text className={`${isCompleted ? 'text-white' : 'text-red-400'} font-pbold text-base`}>D</Text>
                                            </View>
                                        }
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    optionsContainerStyle={{
                                        backgroundColor: '#252D3F',
                                        borderRadius: 16,
                                        marginTop: 40,
                                        borderWidth: 1,
                                        borderColor: '#6366F1',
                                    }}
                                >
                                    <MenuOption
                                        style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}
                                        onSelect={() => handleSetTypeChange(set.id, 'default')}
                                    >
                                        <View className="bg-blue-500/20 w-8 h-8 rounded-lg items-center justify-center mr-3">
                                            <Text className="text-blue-400 font-pbold text-sm">D</Text>
                                        </View>
                                        <Text className="text-white text-base font-pmedium flex-1">Default Set</Text>
                                        <TouchableOpacity
                                            className='bg-accent/10 p-2 rounded-full'
                                            onPress={() => {
                                                setShowSetTypeInfo(true);
                                                setSetTypeInfo('default');
                                            }}
                                        >
                                            <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
                                        </TouchableOpacity>
                                    </MenuOption>
                                    <MenuOption
                                        style={{ padding: 14, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
                                        onSelect={() => handleSetTypeChange(set.id, 'warmup')}
                                    >
                                        <View className="bg-orange-500/20 w-8 h-8 rounded-lg items-center justify-center mr-3">
                                            <Text className="text-orange-400 font-pbold text-sm">W</Text>
                                        </View>
                                        <Text className="text-white text-base font-pmedium flex-1">Warmup Set</Text>
                                        <TouchableOpacity
                                            className='bg-accent/10 p-2 rounded-full'
                                            onPress={() => {
                                                setShowSetTypeInfo(true);
                                                setSetTypeInfo('warmup');
                                            }}
                                        >
                                            <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
                                        </TouchableOpacity>
                                    </MenuOption>
                                    <MenuOption
                                        style={{ padding: 14, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
                                        onSelect={() => handleSetTypeChange(set.id, 'drop')}
                                    >
                                        <View className="bg-purple-500/20 w-8 h-8 rounded-lg items-center justify-center mr-3">
                                            <Text className="text-purple-400 font-pbold text-sm">D</Text>
                                        </View>
                                        <Text className="text-white text-base font-pmedium flex-1">Drop Set</Text>
                                        <TouchableOpacity
                                            className='bg-accent/10 p-2 rounded-full'
                                            onPress={() => {
                                                setShowSetTypeInfo(true);
                                                setSetTypeInfo('drop');
                                            }}
                                        >
                                            <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
                                        </TouchableOpacity>
                                    </MenuOption>
                                    <MenuOption
                                        style={{ padding: 14, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' }}
                                        onSelect={() => handleSetTypeChange(set.id, 'failure')}
                                    >
                                        <View className="bg-red-500/20 w-8 h-8 rounded-lg items-center justify-center mr-3">
                                            <Text className="text-red-400 font-pbold text-sm">F</Text>
                                        </View>
                                        <Text className="text-white text-base font-pmedium flex-1">Failure Set</Text>
                                        <TouchableOpacity
                                            className='bg-accent/10 p-2 rounded-full'
                                            onPress={() => {
                                                setShowSetTypeInfo(true);
                                                setSetTypeInfo('failure');
                                            }}
                                        >
                                            <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
                                        </TouchableOpacity>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>

                        <View className=' items-center justify-center'>
                            {index === 0 && <Text className='text-gray-400 font-pmedium text-xs mb-2'>Previous</Text>}
                            <View className='px-3 py-1 '>
                                <Text className='text-gray-300 font-pmedium text-sm text-center font-bold p-1'>
                                    {prevSet.exercise_reps && prevSet.exercise_weight ?
                                        `${prevSet.exercise_weight} lb ×${prevSet.exercise_reps}` :
                                        '-'
                                    }
                                </Text>
                            </View>
                        </View>

                        <View className='flex-2 items-center justify-center min-w-[70px]'>
                            {index === 0 && <Text className='text-gray-400 font-pmedium text-xs mb-2'>lbs</Text>}
                            <TextInput
                                className={`${isCompleted ? 'text-white bg-transparent' : 'border border-accent/30 bg-surface rounded-lg '}text-white font-pbold text-base px-3 py-2 text-center min-w-[70px]`}
                                style={{
                                    textAlignVertical: 'center',
                                    paddingVertical: 8,
                                    includeFontPadding: false
                                }}
                                onChangeText={(e) => handleWeightChange?.(set, Number(e))}
                                maxLength={4}
                                keyboardType="numeric"
                                editable={!editWorkout}
                            />
                        </View>

                        <View className='flex-2 items-center justify-center min-w-[70px]'>
                            {index === 0 && <Text className='text-gray-400 font-pmedium text-xs mb-2'>Reps</Text>}
                            <TextInput
                                className={`${isCompleted ? 'text-white bg-transparent ' : 'border border-accent/30 bg-surface rounded-lg '}text-white font-pbold text-base px-3 py-2 text-center min-w-[70px]`}
                                style={{
                                    textAlignVertical: 'center',
                                    paddingVertical: 10,
                                    includeFontPadding: false
                                }}
                                placeholder="   "
                                placeholderTextColor="#6B7280"
                                onChangeText={(e) => handleRepChange?.(set, Number(e))}
                                maxLength={3}
                                keyboardType="numeric"
                                editable={!editWorkout}
                            />
                        </View>

                        <View className='items-center justify-center'>
                            {index === 0 && <Text className='text-gray-400 font-pmedium text-xs mb-2'>Done</Text>}
                            <TouchableOpacity
                                onPress={() => setIsCompleted(!isCompleted)}
                                className={`w-10 h-10 rounded-lg items-center justify-center border-2 ${isCompleted
                                    ? 'bg-success border-success'
                                    : 'bg-surface border-gray-600'
                                    }`}
                            >
                                {isCompleted && (
                                    <Ionicons name="checkmark" size={20} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>

            <SetTypeInfo
                showSetTypeInfo={showSetTypeInfo}
                setShowSetTypeInfo={setShowSetTypeInfo}
                setType={setTypeInfo}
            />
        </View>
    )
}

export default RenderSet;