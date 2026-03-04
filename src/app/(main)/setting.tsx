import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import { useLogout } from "@/src/hooks/useLogout";
import { router } from "expo-router"
import { useAvatarFlow } from "@/src/hooks/useAvatarFlow";

export default function HomeScreen() {
  const { onLogout, loading } = useLogout();
  const { avatarUri, selectAndUploadAvatar, loading: avatarLoading } = useAvatarFlow();
  

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Pressable onPress={selectAndUploadAvatar} disabled={avatarLoading}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} className="w-28 h-28 rounded-full" />
        ) : (
          <View className="w-28 h-28 rounded-full bg-gray-300" />
        )}
      </Pressable>
      <Pressable
        onPress={() => router.replace("/(main)/myPage")}
        className="flex-1 items-center justify-center"
      >
        <Text className="text-white text-xl">back</Text>
      </Pressable>

      <View className="flex-1 items-center justify-center bg-black">

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
    </View>
  );
}