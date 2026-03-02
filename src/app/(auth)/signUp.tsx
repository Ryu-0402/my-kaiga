// src/app/(auth)/signup.tsx
import { View, Text, TextInput, Button, Pressable } from "react-native";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // メール確認がONだと、ここではまだログイン完了にならない（確認メール待ち）
    // OFFなら即 session が入って、AuthGate が (main) に飛ばしてくれる。
    if (!data.session) {
      alert("確認メールを送った。メールを開いて認証して。");
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Pressable onPress={() => router.push("/(auth)/login")}>
        <Text className="text-blue-500">Back</Text>
      </Pressable>
      <Text>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? "Loading..." : "Create account"}
        onPress={handleSignUp}
      />
    </View>
  );
}