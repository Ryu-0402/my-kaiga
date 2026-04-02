import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import { useEffect } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    console.log("reset screen session:", !!data.session);
  };

  checkSession();
}, []);

  const handleUpdatePassword = async () => {
    Keyboard.dismiss();

    if (!password.trim() || !confirmPassword.trim()) {
      alert("新しいパスワードを入力してください");
      return;
    }

    if (password.length < 6) {
      alert("パスワードは6文字以上にしてください");
      return;
    }

    if (password !== confirmPassword) {
      alert("確認用パスワードが一致しません");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("パスワードを変更しました");
    router.replace("/(auth)/login");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center px-6">
          <View className="mb-10 items-center">
            <Text className="text-white text-3xl font-bold mb-3">
              New Password
            </Text>
            <Text className="text-gray-400 text-center">
              新しいパスワードを入力してください
            </Text>
          </View>

          <View className="bg-zinc-900 rounded-3xl px-5 py-6">
            <Text className="text-white text-sm mb-2">New Password</Text>
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              className="bg-black text-white rounded-2xl px-4 py-4 mb-4"
            />

            <Text className="text-white text-sm mb-2">Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
              className="bg-black text-white rounded-2xl px-4 py-4 mb-6"
            />

            <Pressable
              onPress={handleUpdatePassword}
              disabled={loading}
              className={`rounded-2xl py-4 items-center ${
                loading ? "bg-gray-600" : "bg-white"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text className="text-black font-bold text-base">
                  パスワードを変更
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}