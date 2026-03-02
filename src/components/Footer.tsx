import { View, Text, Pressable } from "react-native";
import { router } from "expo-router"

export default function Footer() {
  return (
    <View className="flex-row w-full py-8 border-t-4 border-yellow-500 bg-white items-center">

      <Pressable
        onPress={() => router.replace("/(main)")}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-black text-sm">
          1
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/accountScreen")}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-black text-sm">
          2
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/accountScreen")}
        className="flex-1 items-center"
      >
        <Text className="text-black text-sm">
          3
        </Text>
      </Pressable>
    </View>
  );
}