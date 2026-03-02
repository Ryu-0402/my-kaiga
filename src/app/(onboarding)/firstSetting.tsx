import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "../..//lib/supabase";
import { router } from "expo-router";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!username.trim()) {
      Alert.alert("エラー", "ユーザー名を入力してください");
      return;
    }

    setLoading(true);

    // 現在のログインユーザー取得
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert("エラー", "ログインしてください");
      setLoading(false);
      return;
    }

    // accountsテーブルにinsert
    const { error } = await supabase.from("accounts").insert({
      id: user.id,
      username: username,
    });

    setLoading(false);

    if (error) {
      Alert.alert("登録失敗", error.message);
      return;
    }

    // 登録成功 → メインへ
    router.replace("/(main)");
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">
        ユーザー名を決めてください
      </Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        className="border border-gray-300 p-4 rounded-lg mb-6"
      />

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        className="bg-black py-4 rounded-lg"
      >
        <Text className="text-white text-center text-lg">
          {loading ? "登録中..." : "登録する"}
        </Text>
      </Pressable>
    </View>
  );
}