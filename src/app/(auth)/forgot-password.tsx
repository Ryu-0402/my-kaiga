// src/app/(auth)/forgot-password.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useResetPassword } from "@/src/hooks/useResetPassword";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { sendResetEmail, loading } = useResetPassword();

  const onPressSend = async () => {
    Keyboard.dismiss();

    const result = await sendResetEmail(email);

    if (!result.ok) {
      Alert.alert("失敗", result.message);
      return;
    }

    Alert.alert("送信完了", result.message);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6 justify-center">
          
          {/* 🔙 戻るボタン */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-14 left-6"
          >
            <Text className="text-white text-lg">← 戻る</Text>
          </Pressable>

          <View className="w-full max-w-sm self-center">
            <Text className="text-white text-2xl font-bold mb-6 text-center">
              パスワード再設定
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="メールアドレス"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-zinc-900 text-white rounded-xl px-4 py-4 mb-4"
            />

            <Pressable
              onPress={onPressSend}
              disabled={loading}
              className={`rounded-xl py-4 ${
                loading ? "bg-zinc-700" : "bg-white"
              }`}
            >
              <Text className="text-center font-bold text-black">
                {loading ? "送信中..." : "再設定メールを送る"}
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}