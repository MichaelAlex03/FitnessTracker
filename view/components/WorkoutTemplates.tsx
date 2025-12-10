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

    // Calculate exercise count for each template
    const getExerciseCount = (templateId: number) => {
        return workoutTemplateExercises.filter(ex => ex.workout_template_id === templateId).length;
    };

    const renderTemplate = ({ item }: { item: WorkoutTemplate }) => {
        const exerciseCount = getExerciseCount(item.id);

        return (
            <TouchableOpacity
                className='mx-5 mb-3 bg-surface rounded-2xl border-2 border-gray-700 p-4 active:scale-[0.98]'
                onPress={() => {
                    setTemplateId(item.id);
                    setTemplateWorkoutName(item.workout_name);
                    setViewWorkoutTemplate(true);
                }}
            >
                <View className='flex-row items-center'>
                    {/* Template Icon */}
                    <View className='bg-accent/20 rounded-2xl p-3 mr-4'>
                        <Icon name="content-copy" size={28} color="#6366F1" />
                    </View>

                    {/* Template Info */}
                    <View className='flex-1'>
                        <Text className='text-white font-pbold text-lg mb-1' numberOfLines={1}>
                            {item.workout_name}
                        </Text>
                        <View className='flex-row items-center'>
                            <Icon name="fitness-center" size={14} color="#6B7280" style={{ marginRight: 4 }} />
                            <Text className='text-gray-400 font-pmedium text-sm'>
                                {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Arrow Icon */}
                    <View className='bg-gray-700 rounded-full p-2'>
                        <AntDesign name="right" size={16} color="#6B7280" />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View className='flex-1 items-center justify-center px-6 py-20'>
            <View className='bg-gray-700/30 rounded-full p-8 mb-6'>
                <Icon name="content-copy" size={64} color="#6B7280" />
            </View>
            <Text className='text-white font-pbold text-2xl mb-3 text-center'>
                No Templates Found
            </Text>
            <Text className='text-gray-400 font-pmedium text-base text-center mb-6'>
                {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Templates will appear here once created'}
            </Text>
        </View>
    );

    const renderHeader = () => (
        <View className='px-5 pb-4'>
            <View className='bg-accent/10 border-2 border-accent/30 rounded-2xl p-4 flex-row items-center mb-4'>
                <View className='bg-accent rounded-full p-3 mr-4'>
                    <Icon name="wb-auto" size={24} color="white" />
                </View>
                <View className='flex-1'>
                    <Text className='text-white font-pbold text-sm mb-1'>Quick Start</Text>
                    <Text className='text-gray-400 font-pmedium text-xs'>
                        {workoutTemplates.length} template{workoutTemplates.length !== 1 ? 's' : ''} available
                    </Text>
                </View>
            </View>
        </View>
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

               
                <View className='flex-row items-center justify-between px-5 py-4 border-b-2 border-gray-700'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-white font-pextrabold text-3xl mb-1' numberOfLines={1}>
                            Workout Templates
                        </Text>
                        <Text className='text-gray-400 font-pmedium text-sm'>
                            Choose a template to get started
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        className='bg-gray-700 p-3 rounded-xl'
                    >
                        <AntDesign name="close" size={22} color="white" />
                    </TouchableOpacity>
                </View>

               
                <View className='px-5 py-4'>
                    <View className='bg-surface border-2 border-gray-700 rounded-2xl h-14 flex-row items-center px-4'>
                        <AntDesign name="search" size={20} color="#6B7280" />
                        <TextInput
                            className='text-white flex-1 ml-3 font-pmedium text-base'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search templates..."
                            placeholderTextColor='#6B7280'
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <AntDesign name="close-circle" size={18} color="#6B7280" />
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
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={renderEmptyState}
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
