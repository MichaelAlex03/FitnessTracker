import { Text, View, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from '../components/CustomButton'

import '../index.css'

export default function Index() {
  return (
    <SafeAreaView className='flex-1 w-full justify-center bg-[#161622] h-full items-center' edges={['top', 'left', 'right']}>
      <View>
        <Text className="text-white text-3xl font-bold">Welcome To <Text className="text-secondary-200">FitTrackr</Text></Text>
      </View>
      <View className="w-3/4 items-center">
        <CustomButton
          title='Login'
          handlePress={() => router.replace("/Login")}
          containerStyles="w-3/4 mt-7 bg-secondary"
        />
        <CustomButton
          title='Sign Up'
          handlePress={() => router.replace("/Register")}
          containerStyles="w-3/4 mt-7 bg-secondary"
        />
      </View>
    </SafeAreaView>
  );
}

