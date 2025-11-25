import { Stack } from 'expo-router'
import React from 'react'

const authLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' />
      <Stack.Screen name='Register' />
      <Stack.Screen name='ConfirmRegister' />
      <Stack.Screen name='ForgotPassword' />
    </Stack>
  )
}

export default authLayout