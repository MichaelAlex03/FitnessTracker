import { View, Image, ImageSourcePropType } from 'react-native'
import { Redirect, Tabs } from 'expo-router'
import useAuth from '@/hooks/useAuth';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { icons } from '../../constants'

interface TabIconProps {
    icon: ImageSourcePropType,
    color: string,
}

const TabIcon = ({ icon, color }: TabIconProps) => {
    return (
        <View className='items-center justify-center'>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className='w-6 h-6'
            />
        </View>

    )
}

const TabsLayout = () => {

    const { auth, loggedIn } = useAuth();

    if (!loggedIn && !auth?.user) return <Redirect href={'/Login'} />

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: '#6B7280',
                tabBarStyle: {
                    backgroundColor: '#0A0E1A',
                    borderTopWidth: 1,
                    borderTopColor: '#1E2433',
                    height: 84,
                },
                headerShown: false
            }}>
            <Tabs.Screen
                name='Profile'
                options={{
                    tabBarIcon: ({ color }) => (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name='History'
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="history" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='Workouts'
                options={{
                    tabBarIcon: ({ color }) => (
                        <Feather name="plus-circle" size={24} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name='Exercises'
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="weight-pound" size={24} color={color} />
                    )
                }} />
            <Tabs.Screen
                name='Chatbot'
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="robot-excited-outline" size={24} color={color} />
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout