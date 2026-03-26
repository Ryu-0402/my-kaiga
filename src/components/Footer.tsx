import { View, Text, Pressable } from "react-native";
import { router, usePathname } from "expo-router";
import { useAccount } from "@/src/providers/AccountProvider";
import { Image } from "expo-image";

export default function Footer() {
  const { account } = useAccount();
  const pathname = usePathname(); // ←これ追加

  const avatarUrl = account?.avatar_url ?? undefined;

  const isHome = pathname === "/";
  const isPost = pathname === "/postScreen";
  const isMyPage = pathname === "/myPage";

  return (
    <View className="flex-row w-full py-2 bg-white items-center">

      {/* Home */}
      <Pressable
        disabled={isHome}
        onPress={() => router.replace("/(main)")}
        className="flex-1 items-center justify-center"
      >
        <Text className={`text-[28px] ${isHome ? "text-gray-400" : "text-black"}`}>
          🔍
        </Text>
      </Pressable>

      {/* Post */}
      <Pressable
        disabled={isPost}
        onPress={() => router.replace("/postScreen")}
        className="flex-1 items-center justify-center"
      >
        <Text className={`text-[24px] ${isPost ? "text-gray-400" : "text-black"}`}>
          +
        </Text>
      </Pressable>

      {/* MyPage */}
      <Pressable
        disabled={isMyPage}
        onPress={() => router.replace("/myPage")}
        className="flex-1 items-center"
      >
        {avatarUrl ? (
          <Image
            className={`bg-gray-50 ${isMyPage ? "opacity-40" : ""}`}
            source={{ uri: avatarUrl }}
            style={{ width: 30, height: 30, borderRadius: 40 }}
          />
        ) : (
          <View
            className={`rounded-full bg-gray-500 ${isMyPage ? "opacity-40" : ""}`}
            style={{ width: 30, height: 30 }}
          >
            <Text className="text-center">あ</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}