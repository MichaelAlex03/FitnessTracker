import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthProvider";
import { MenuProvider } from 'react-native-popup-menu';
import '../index.css'

export default function RootLayout() {

  return (
    <AuthProvider>
      <MenuProvider>
        <Stack>
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='index' options={{ headerShown: false }} />
        </Stack>
      </MenuProvider>
    </AuthProvider>
  )
}
