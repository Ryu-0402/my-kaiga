import { View, Text } from "react-native";
import Footer from "@/src/components/Footer";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">

      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-yellow-500 text-2xl font-bold">home</Text>
        <View className="mt-4 h-10 w-40 rounded-xl bg-green-500" />
      </View>

      <Footer />
    </View>
  );
}