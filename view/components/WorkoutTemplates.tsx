import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ViewWorkoutTemplate from './ViewWorkoutTemplate'


interface WorkoutTemplate {
    id: number
    workout_name: string
}

interface TemplateExercises {
    id: number
    exercise_name: string
    workout_template_id: number
}


interface WorkoutTemplatesProps {
    visible: boolean;
    onClose: () => void;
    workoutTemplates: WorkoutTemplate[];
    workoutTemplateExercises: TemplateExercises[];
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
}

const WorkoutTemplates = ({ visible, onClose, workoutTemplates, workoutTemplateExercises, refresh, setRefresh }: WorkoutTemplatesProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [templateId, setTemplateId] = useState<WorkoutTemplate['id']>(0);
    const [viewWorkoutTemplate, setViewWorkoutTemplate] = useState<boolean>(false);
    const [templateWorkoutName, setTemplateWorkoutName] = useState<string>("")


    const filteredTemplates = workoutTemplates.filter(template =>
        template.workout_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTemplate = ({ item }: { item: WorkoutTemplate }) => (
        <TouchableOpacity
            className='mx-4 mb-3 bg-surface rounded-2xl border-2 border-accent/20 p-5 active:scale-[0.98]'
            onPress={() => {
                setTemplateId(item.id);
                setTemplateWorkoutName(item.workout_name);
                setViewWorkoutTemplate(true);
            }}
        >
            <View className='flex-row items-center justify-between mb-2'>
                <View className='flex-row items-center flex-1'>
                    <View className='flex-1'>
                        <Text className='text-white font-pbold text-lg mb-1'>
                            {item.workout_name}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            presentationStyle="fullScreen"
            statusBarTranslucent={false}
        >
            <SafeAreaView className='flex-1 bg-primary' edges={['top', 'bottom']}>
                <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />

                <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-700'>
                    <View className='flex-1'>
                        <Text className='text-white font-pextrabold text-3xl mb-1'>
                            Workout Templates
                        </Text>
                        <Text className='text-gray-400 font-pmedium text-sm'>
                            Choose a template to get started
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        className='bg-gray-700 p-2 rounded-xl'
                    >
                        <AntDesign name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className='px-6 py-4'>
                    <View className='bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
                        <AntDesign name="search1" size={20} color="#6B7280" />
                        <TextInput
                            className='text-white flex-1 ml-3 font-pmedium text-base'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search templates..."
                            placeholderTextColor='#6B7280'
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <AntDesign name="closecircle" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <FlatList
                    data={filteredTemplates}
                    renderItem={renderTemplate}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />

            </SafeAreaView>
            {
                viewWorkoutTemplate && (
                    <ViewWorkoutTemplate
                        visible={viewWorkoutTemplate}
                        setVisible={setViewWorkoutTemplate}
                        workoutTemplateExercises={workoutTemplateExercises}
                        workoutTemplateId={templateId} 
                        workoutTemplateName={templateWorkoutName}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        onClose={onClose}
                    />
                )
            }
        </Modal>
    );
};

export default WorkoutTemplates;
