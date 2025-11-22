import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import axios from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { AxiosError } from 'axios'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface RateLimitError {
  msg: string;
  remaining: number;
  reset: number;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null)

  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();

  const handleUpgrade = () => {
    
    Alert.alert(
      "Upgrade to Pro",
      "Get unlimited AI coaching requests and premium features!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Upgrade", onPress: () => console.log("Navigate to payment") }
      ]
    )
  }


  const handleSendMessage = async () => {
    if (inputText.trim() === '') return

    let userText = inputText;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    }



    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)


    try {
      const response = await axiosPrivate.post(`/api/openAI`, {
        userText
      })
      const aiMessage: Message = {
        id: response.data.response.id,
        text: response.data.response.output_text,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const error = err as AxiosError<RateLimitError>;
      console.log("hello")
      if (error.response?.status === 429) {
        console.log(error.response.data)
        const { msg, remaining, reset } = error.response.data;
        const resetDate = new Date(reset * 1000);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `⚠️ Rate limit exceeded!\n\nYou have ${remaining} requests remaining.\nResets at 
          ${resetDate.toLocaleTimeString()}\n\nUpgrade to Pro for unlimited requests!`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        Alert.alert("Error generating response", "There was an error generating a response please try again", [{
          text: "Ok",
          onPress: () => setMessages([])
        }])
      }
    } finally {
      setIsTyping(false)
    }

  }

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View className={`mb-4 px-4 ${item.isUser ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] rounded-2xl p-4 ${item.isUser
          ? 'bg-accent rounded-br-none'
          : 'bg-surface border-2 border-gray-700 rounded-bl-none'
          }`}>
          <Text className={`${item.isUser ? 'text-white' : 'text-gray-200'} font-pmedium text-base leading-6`}>
            {item.text}
          </Text>
          <Text className={`${item.isUser ? 'text-white/70' : 'text-gray-500'} font-pregular text-xs mt-2`}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View className='flex-1 justify-center items-center px-8'>
      <View className='bg-accent/10 rounded-full p-6 mb-6'>
        <MaterialCommunityIcons name="robot-excited-outline" size={64} color="#6366F1" />
      </View>
      <Text className='text-white text-2xl font-pbold text-center mb-3'>
        AI Fitness Coach
      </Text>
      <Text className='text-gray-400 text-base font-pmedium text-center mb-6'>
        Ask me anything about workouts, nutrition, form tips, or motivation!
      </Text>

      <View className='w-full gap-3'>
        <TouchableOpacity
          className='bg-surface border-2 border-accent/30 rounded-2xl p-4 active:bg-surface-elevated'
          onPress={() => setInputText("What's the best workout for building muscle?")}
        >
          <Text className='text-accent text-sm font-pmedium'>
            💪 What's the best workout for building muscle?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-surface border-2 border-accent/30 rounded-2xl p-4 active:bg-surface-elevated'
          onPress={() => setInputText("How can I improve my bench press form?")}
        >
          <Text className='text-accent text-sm font-pmedium'>
            🏋️ How can I improve my bench press form?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-surface border-2 border-accent/30 rounded-2xl p-4 active:bg-surface-elevated'
          onPress={() => setInputText("What should I eat before a workout?")}
        >
          <Text className='text-accent text-sm font-pmedium'>
            🥗 What should I eat before a workout?
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  )

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >

        <View className='px-6 pt-6 pb-4 border-b-2 border-surface'>
          <View className='flex-row items-center'>
            <View className='bg-accent/20 rounded-full p-3 mr-4'>
              <MaterialCommunityIcons name="robot-excited-outline" size={28} color="#6366F1" />
            </View>
            <View className='flex-1'>
              <Text className='text-white font-pbold text-2xl'>AI Coach</Text>
              <Text className='text-gray-400 font-pmedium text-sm'>
                Powered by ChatGPT-5
              </Text>
            </View>
            <TouchableOpacity
              className='bg-yellow-500/20 border border-yellow-500/50 px-3 py-2 rounded-xl flex-row items-center gap-2 mr-2'
              onPress={handleUpgrade}
            >
              <MaterialCommunityIcons name="crown" size={16} color="#EAB308" />
              <Text className='text-yellow-500 font-pbold text-sm'>Pro</Text>
            </TouchableOpacity>
            {messages.length > 0 && (
              <TouchableOpacity
                className='bg-surface-elevated p-3 rounded-xl'
                onPress={() => setMessages([])}
              >
                <Ionicons name="refresh" size={20} color="#6366F1" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {isTyping && (
          <View className='px-4 mb-2'>
            <View className='bg-surface border-2 border-gray-700 rounded-2xl rounded-bl-none p-4 max-w-[80%]'>
              <View className='flex-row items-center gap-1'>
                <View className='w-2 h-2 bg-accent rounded-full animate-pulse' />
                <View className='w-2 h-2 bg-accent rounded-full animate-pulse' style={{ animationDelay: '0.2s' }} />
                <View className='w-2 h-2 bg-accent rounded-full animate-pulse' style={{ animationDelay: '0.4s' }} />
              </View>
            </View>
          </View>
        )}

        <View className='px-4 pb-4 pt-2 bg-primary border-t-2 border-surface'>
          <View className='flex-row items-center bg-surface border-2 border-gray-700 rounded-2xl px-4 py-2'>
            <TextInput
              className='flex-1 text-white font-pmedium text-base py-2'
              placeholder="Ask me anything..."
              placeholderTextColor='#6B7280'
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              className={`ml-3 rounded-xl p-3 ${inputText.trim() ? 'bg-accent' : 'bg-gray-700'}`}
              onPress={handleSendMessage}
              disabled={inputText.trim() === ''}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? 'white' : '#6B7280'}
              />
            </TouchableOpacity>
          </View>
          <Text className='text-gray-500 text-xs font-pregular mt-2 text-center'>
            AI responses may not always be accurate. Consult a professional for medical advice.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Chatbot
