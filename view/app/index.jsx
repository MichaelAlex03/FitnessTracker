import { Text, View, Pressable } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable>
        <Text>Log in</Text>
      </Pressable>
      <Pressable>
        <Text>Create Account</Text>
      </Pressable>
    </View>
  );
}
