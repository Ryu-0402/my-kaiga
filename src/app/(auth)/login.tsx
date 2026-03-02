// src/app/(auth)/login.tsx

import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Link, router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false)
    }
    
    setLoading(false);
    router.replace("/")
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

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
        title={loading ? "Loading..." : "Login"}
        onPress={handleLogin}
      />

      <Link className=""
       href="/(auth)/signUp">新規登録
      </Link>
    </View>
  );
}