import React, { useState, useEffect } from 'react'
import { Modal, View, TouchableOpacity, Text, ScrollView, Alert } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStripe } from '@stripe/stripe-react-native';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useAuth from '@/hooks/useAuth';


interface ProModalProps {
    showProModal: boolean,
    setShowProModal: React.Dispatch<React.SetStateAction<boolean>>
}

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => (
    <View className='bg-surface border border-gray-700 rounded-2xl p-5 mb-4'>
        <View className='flex-row items-start gap-4'>
            <View className='bg-yellow-500/20 rounded-xl p-3'>
                {icon}
            </View>
            <View className='flex-1'>
                <Text className='text-white font-pbold text-lg mb-1'>{title}</Text>
                <Text className='text-gray-400 font-pmedium text-sm leading-5'>{description}</Text>
            </View>
        </View>
    </View>
)

const ProBenefits = ({ showProModal, setShowProModal }: ProModalProps) => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await axiosPrivate.post('/api/stripe/payment-sheet', {
                email: auth.email
            })

            const { paymentIntent, ephemeralKey, customer } = response.data

            return {
                paymentIntent,
                ephemeralKey,
                customer
            }
        } catch (error) {
            console.log(error)
        }
    }

    const initializePaymentSheet = async () => {
        const params = await fetchPaymentSheetParams();
        if (!params) {
            console.error('Failed to fetch payment sheet parameters');
            return;
        }
        const { paymentIntent, ephemeralKey, customer } = params;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "FitTrackr",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent
        })
    }

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
    
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
          } else {
            Alert.alert('Success', 'Your order is confirmed!');
          }
    }

    useEffect(() => {
        initializePaymentSheet();
    }, [])

    return (
        <Modal
            visible={showProModal}
            transparent={false}
            animationType='slide'
            onRequestClose={() => setShowProModal(false)}
        >
            <SafeAreaView className='flex-1 bg-primary'>
                <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>

                    <View className='items-center px-6 pt-4 pb-8'>
                        <View className='bg-yellow-500/20 rounded-full p-6 mb-6'>
                            <MaterialCommunityIcons name="crown" size={64} color="#EAB308" />
                        </View>
                        <Text className='text-white font-pbold text-3xl text-center mb-2'>
                            Upgrade to Pro
                        </Text>
                        <Text className='text-gray-400 font-pmedium text-base text-center'>
                            Unlock the full potential of your AI fitness coach
                        </Text>
                    </View>

                    <View className='px-6'>
                        <BenefitCard
                            icon={<MaterialCommunityIcons name="infinity" size={28} color="#EAB308" />}
                            title="Unlimited AI Requests"
                            description="Chat with your AI coach as much as you want. No daily limits, no restrictions. Get instant answers to all your fitness questions."
                        />

                        <BenefitCard
                            icon={<MaterialCommunityIcons name="robot-excited-outline" size={28} color="#EAB308" />}
                            title="AI Workout Generator"
                            description="Tell the AI what you want to focus on and it will generate a complete workout for you. Automatically creates and saves workouts to your app."
                        />

                        <BenefitCard
                            icon={<Ionicons name="fitness" size={28} color="#EAB308" />}
                            title="Personal Workout Assistant"
                            description="Your AI assistant helps you track progress, adjust your workouts, and provides personalized recommendations based on your goals."
                        />
                    </View>

                    <View className='px-6 pt-6 pb-4'>
                        <View className='bg-surface border-2 border-yellow-500/50 rounded-2xl p-6'>
                            <View className='flex-row items-baseline justify-center mb-2'>
                                <Text className='text-yellow-500 font-pbold text-4xl'>$9.99</Text>
                                <Text className='text-gray-400 font-pmedium text-base'>/month</Text>
                            </View>
                            <Text className='text-gray-400 font-pmedium text-sm text-center'>
                                Cancel anytime. No commitments.
                            </Text>
                        </View>
                    </View>

                    <View className='px-6 pt-4 pb-8'>
                        <TouchableOpacity
                            className='bg-yellow-500 rounded-2xl py-4 flex-row items-center justify-center gap-2'
                            onPress={openPaymentSheet}
                        >
                            <MaterialCommunityIcons name="crown" size={24} color="#000" />
                            <Text className='text-black font-pbold text-lg'>Subscribe to Pro</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className='mt-4 py-3'
                            onPress={() => setShowProModal(false)}
                        >
                            <Text className='text-gray-500 font-pmedium text-base text-center'>
                                Maybe later
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

export default ProBenefits