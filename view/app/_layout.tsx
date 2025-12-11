import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "@/context/AuthProvider";
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../index.css'
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0A0E1A" />
        <AuthProvider>
          <MenuProvider>
            <Stack>
              <Stack.Screen name='(auth)' options={{ headerShown: false }} />
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen name='index' options={{ headerShown: false }} />
            </Stack>
          </MenuProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
