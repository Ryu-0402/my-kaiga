import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();

    if (!email.trim() || !password.trim()) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      alert("確認メールを送信しました。メールを開いて認証してください。");
    } else {
      router.replace("/");
    }

    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-10">
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-white text-base mb-6">← back</Text>
            </Pressable>

            <View className="items-center">
              <Text className="text-white text-4xl font-bold mb-3">
                Sign Up
              </Text>
            </View>
          </View>

          <View className="bg-zinc-900 rounded-3xl px-5 py-6">
            <Text className="text-white text-sm mb-2">Email</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              className="bg-black text-white rounded-2xl px-4 py-4 mb-4"
            />

            <Text className="text-white text-sm mb-2">Password</Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              className="bg-black text-white rounded-2xl px-4 py-4 mb-6"
            />

            <Pressable
              onPress={handleSignUp}
              disabled={loading}
              className={`rounded-2xl py-4 items-center ${
                loading ? "bg-gray-600" : "bg-white"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text className="text-black font-bold text-base">
                  Create account
                </Text>
              )}
            </Pressable>
          </View>

          <View className="mt-8 items-center">
            <Text className="text-gray-400 mb-2">
              すでにアカウントを持っている？
            </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-white font-bold text-base">ログインへ</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}