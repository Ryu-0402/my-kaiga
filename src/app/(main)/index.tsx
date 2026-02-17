import { View, Text } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-2xl font-bold">in main</Text>
      <View className="mt-4 h-10 w-40 rounded-xl bg-green-500" />
    </View>
  );
}