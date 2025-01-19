import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthProvider";
import '../index.css'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='index' options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
