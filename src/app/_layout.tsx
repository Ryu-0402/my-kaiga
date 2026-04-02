import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { AccountProvider } from "../providers/AccountProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";

function getHashParams(url: string) {
  const hash = url.split("#")[1];
  if (!hash) return {};

  return Object.fromEntries(
    hash.split("&").map((part) => {
      const [key, value] = part.split("=");
      return [decodeURIComponent(key), decodeURIComponent(value ?? "")];
    })
  );
}

export default function RootLayout() {
  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;

      console.log("deep link url:", url);

      try {
        // 1. まず hash を見る
        const hashParams = getHashParams(url);
        const accessToken =
          typeof hashParams.access_token === "string"
            ? hashParams.access_token
            : null;
        const refreshToken =
          typeof hashParams.refresh_token === "string"
            ? hashParams.refresh_token
            : null;

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.log("setSession error:", error.message);
          } else {
            console.log("setSession success");
          }

          return;
        }

        // 2. query に code がある型も一応拾う
        const parsed = Linking.parse(url);
        const code =
          typeof parsed.queryParams?.code === "string"
            ? parsed.queryParams.code
            : null;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.log("exchangeCodeForSession error:", error.message);
          } else {
            console.log("exchangeCodeForSession success");
          }

          return;
        }

        console.log("tokenもcodeもなし");
      } catch (e: any) {
        console.log("deep link処理エラー:", e?.message ?? e);
      }
    };

    Linking.getInitialURL().then(handleUrl);

    const sub = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("auth event:", event);
      console.log("has session:", !!session);
    });

    return () => {
      sub.remove();
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <AccountProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </AccountProvider>
    </AuthProvider>
  );
}