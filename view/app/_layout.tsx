import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthProvider";
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../index.css'

export default function RootLayout() {
  return (
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
  )
}
