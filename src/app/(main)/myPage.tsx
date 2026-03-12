import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Footer from "@/src/components/Footer";
import { useAccount } from "@/src/providers/AccountProvider";
import { router } from "expo-router";
import { Image } from "expo-image";

export default function HomeScreen() {
  const { account, loading } = useAccount();

  if (loading) {
    return (
      <Text>
        loading...
      </Text>
    )
  }

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Image
        source={account?.avatar_url ? { uri: account.avatar_url } : undefined}
        style={{ width: 80, height: 80, borderRadius: 40 }}
      />
      <Text className="text-white">{account?.username ?? "no name"}</Text>
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