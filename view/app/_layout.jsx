import { Stack } from "expo-router";
import '../index.css'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(auth)' option={{ headerShown: false }} />
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  )
}