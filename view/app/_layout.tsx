import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthProvider";
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import { StripeProvider } from '@stripe/stripe-react-native'
import { useState } from "react";
import '../index.css'

export default function RootLayout() {

  const [publishableKey] = useState<string>(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

  return (
    <StripeProvider
      publishableKey={publishableKey}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <MenuProvider>
            <Stack>
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='index' options={{ headerShown: false }} />
            </Stack>
          </MenuProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </StripeProvider>
  )
}
