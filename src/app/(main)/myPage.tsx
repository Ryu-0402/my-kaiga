import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Footer from "@/src/components/Footer";
import { useLogout } from "@/src/hooks/useLogout";
import { router } from "expo-router"

export default function HomeScreen() {

  return (
    <View className="flex-1 items-center justify-center bg-black">

      <Pressable
        onPress={() => router.replace("/setting")}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-white text-xl">setting</Text>
      </Pressable>

      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-yellow-500 text-2xl font-bold">account</Text>

        
      </View>

      <Footer />
    </View>
  );
}