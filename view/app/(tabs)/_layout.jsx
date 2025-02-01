import { View, Image } from 'react-native'
import { Redirect, Tabs } from 'expo-router'
import useAuth from '@/hooks/useAuth';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused }) => {
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

    if (!loggedIn && !auth?.user) return <Redirect href={'/Login'} replace />

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FFA001',
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarStyle: {
                    backgroundColor: '#161622',
                    borderTopWidth: 1,
                    borderTopColor: '#232533',
                    height: 84,
                },
                headerShown: false
            }}>
            <Tabs.Screen
                name='Profile'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
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