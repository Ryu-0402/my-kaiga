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
import { Link, router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email.trim() || !password.trim()) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace("/");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-10 items-center">
            <Text className="text-white text-4xl font-bold mb-3">Login</Text>
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
              className="bg-black text-white rounded-2xl px-4 py-4 mb-3"
            />

            <View className="items-end mb-6">
              <Link href="/(auth)/forgot-password" asChild>
                <Pressable disabled={loading}>
                  <Text className="text-gray-300 text-sm">
                    パスワードを忘れた場合
                  </Text>
                </Pressable>
              </Link>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className={`rounded-2xl py-4 items-center ${
                loading ? "bg-gray-600" : "bg-white"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text className="text-black font-bold text-base">Login</Text>
              )}
            </Pressable>
          </View>

          <View className="mt-8 items-center">
            <Text className="text-gray-400 mb-2">アカウントを持っていない？</Text>
            <Link href="/(auth)/signUp" asChild>
              <Pressable>
                <Text className="text-white font-bold text-base">新規登録</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}