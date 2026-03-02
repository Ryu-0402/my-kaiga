import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { View, ActivityIndicator } from "react-native";

export default function AuthGate() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1) 起動時にセッション取得
    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (!mounted) return;

        if (error) {
          console.warn("getSession error:", error.message);
          setSession(data.session ?? null);
          setLoading(false);
        }

        const s = data.session ?? null;
        setSession(s);

        if (!s) {
          setLoading(false);
          return;
        }

        const { data: account } = await supabase
          .from("accounts")
          .select("id")
          .eq("id", s.user.id)
          .maybeSingle();
        
        setHasAccount(!!account);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        console.warn("getSession exception:", e);
        setSession(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);


  // ローディング中はローディング表示
  if (loading) return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );

  // 未ログインなら auth へ
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (hasAccount === false) {
    return <Redirect href="/(onboarding)/firstSetting" />;
  }
  // ログイン済みなら main へ
  console.log("現在のsession:", session);
  return <Redirect href="/(main)" />;
}

