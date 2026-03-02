import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Footer from "@/src/components/Footer";
import { useLogout } from "@/src/hooks/useLogout";

export default function HomeScreen() {
  const { onLogout, loading } = useLogout();

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-yellow-500 text-2xl font-bold">account</Text>

        <Pressable
          onPress={onLogout}
          disabled={loading}
          className="mt-4 bg-red-500 px-6 py-3 rounded-xl"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">log out</Text>
          )}
        </Pressable>
      </View>

      <Footer />
    </View>
  );
}