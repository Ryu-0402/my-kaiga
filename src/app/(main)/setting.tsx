import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLogout } from "@/src/hooks/useLogout";
import { router } from "expo-router";
import { useAvatarFlow } from "@/src/hooks/useAvatarFlow";
import { useUpdateUsername } from "@/src/hooks/useUpdateUsername";
import { useState, useEffect } from "react";
import { useAccount } from "@/src/providers/AccountProvider";

export default function HomeScreen() {
  const { account } = useAccount();
  const { onLogout, loading: logoutLoading } = useLogout();
  const {
    avatarUri,
    selectAndUploadAvatar,
    loading: avatarLoading,
  } = useAvatarFlow();

  const [username, setUsername] = useState("");

  const {
    loading: updateUsernameLoading,
    updateUsername,
  } = useUpdateUsername();

  const displayAvatar = avatarUri ?? account?.avatar_url;

  useEffect(() => {
    setUsername(account?.username ?? "");
  }, [account?.username]);

  const onPressSave = async () => {
    Keyboard.dismiss(); // ←追加（保存時も閉じる）

    const result = await updateUsername(username);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black px-6 pt-16 pb-10">
        {/* header */}
        <View className="mb-10">
          <Pressable onPress={() => router.replace("/(main)/myPage")}>
            <Text className="text-white text-base">← back</Text>
          </Pressable>
        </View>

        {/* main */}
        <View className="flex-1 items-center">
          {/* avatar */}
          <Pressable
            onPress={selectAndUploadAvatar}
            disabled={avatarLoading}
            className="mb-8"
          >
            {displayAvatar ? (
              <Image
                source={{ uri: displayAvatar }}
                className="w-28 h-28 rounded-full "
              />
            ) : (
              <View className="w-28 h-28 rounded-full bg-gray-300" />
            )}

            {avatarLoading && (
              <View className="absolute inset-0 items-center justify-center">
                <ActivityIndicator color="white" />
              </View>
            )}
          </Pressable>

          {/* username */}
          <Text className="text-white text-lg font-bold mb-2">
            ユーザー名
          </Text>

          <TextInput
            value={username}
            onChangeText={(text) => {
              if (text.length <= 10) setUsername(text);
            }}
            maxLength={10} // ←これでもOK（シンプル）
            placeholder="新しい名前(10文字以内)"
            placeholderTextColor="#999"
            editable={!updateUsernameLoading}
            className="w-full bg-white rounded-xl px-4 py-4 mb-4 text-black"
          />

          {/* save */}
          <Pressable
            onPress={onPressSave}
            disabled={updateUsernameLoading}
            className={`w-full rounded-xl py-4 ${updateUsernameLoading ? "bg-gray-500" : "bg-white"
              }`}
          >
            <Text className="text-center text-black font-bold">
              {updateUsernameLoading ? "更新中..." : "保存"}
            </Text>
          </Pressable>
        </View>

        {/* footer */}
        <Pressable
          onPress={onLogout}
          disabled={logoutLoading}
          className="bg-red-500 px-6 py-4 rounded-xl"
        >
          {logoutLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">
              log out
            </Text>
          )}
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}