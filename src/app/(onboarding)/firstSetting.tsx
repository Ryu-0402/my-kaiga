import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../..//lib/supabase";
import { router } from "expo-router";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert("権限エラー", "写真へのアクセスが必要です");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uriToUint8Array = async (uri: string) => {
    const b64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    const binary = globalThis.atob(b64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  };

  const onSubmit = async () => {
    const trimmed = username.trim();

    if (!trimmed) {
      Alert.alert("エラー", "ユーザー名を入力してください");
      return;
    }

    if (trimmed.length > 10) {
      Alert.alert("エラー", "10文字以内にしてください");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        Alert.alert("エラー", "ログインしてください");
        return;
      }

      let avatarUrl: string | null = null;

      if (imageUri) {
        const bytes = await uriToUint8Array(imageUri);
        const path = `${user.id}/avatar.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, bytes, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          Alert.alert("画像アップロード失敗", uploadError.message);
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        avatarUrl = data.publicUrl;
      }

      const { error } = await supabase.from("accounts").insert({
        id: user.id,
        username: trimmed,
        avatar_url: avatarUrl,
      });

      if (error) {
        Alert.alert("登録失敗", error.message);
        return;
      }

      router.replace("/(main)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      
      {/* 中央コンテナ */}
      <View className="w-full max-w-md items-center">

        {/* タイトル */}
        <Text className="text-white text-3xl font-bold mb-10">
          プロフィール作成
        </Text>

        {/* アバター */}
        <Pressable onPress={pickImage} className="mb-10">
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              className="w-28 h-28 rounded-full"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-zinc-800 items-center justify-center">
              <Text className="text-4xl text-zinc-500">+</Text>
            </View>
          )}
        </Pressable>

        {/* 入力 */}
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="ユーザー名 (10文字以内)"
          placeholderTextColor="#6b7280"
          maxLength={10}
          className="w-full bg-zinc-900 text-white px-4 py-4 rounded-xl mb-6 border border-zinc-800"
        />

        {/* ボタン */}
        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className={`w-full py-4 rounded-xl ${
            loading ? "bg-zinc-700" : "bg-white"
          }`}
        >
          <View className="flex-row items-center justify-center">
            {loading && (
              <ActivityIndicator color="black" className="mr-2" />
            )}
            <Text className="text-center text-lg font-bold text-black">
              {loading ? "登録中..." : "登録する"}
            </Text>
          </View>
        </Pressable>

      </View>
    </View>
  );
}