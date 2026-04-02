// src/hooks/useResetPassword.ts
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

type ResetPasswordResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export function useResetPassword() {
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (
    email: string
  ): Promise<ResetPasswordResult> => {
    const trimmed = email.trim();

    if (!trimmed) {
      return { ok: false, message: "メールアドレスを入力してください" };
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        // ここはあとで自分のURLに変える
        // Webなら https://example.com/update-password
        // Expoなら deep link を使うことが多い
        redirectTo: "kaiga://reset-password",
      });

      if (error) {
        return { ok: false, message: error.message };
      }

      return {
        ok: true,
        message: "パスワード再設定メールを送信しました",
      };
    } catch (e: any) {
      return {
        ok: false,
        message: e?.message ?? "メール送信に失敗しました",
      };
    } finally {
      setLoading(false);
    }
  };

  return { sendResetEmail, loading };
}