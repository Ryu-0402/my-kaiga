import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAccount } from "@/src/providers/AccountProvider";

type UpdateUsernameResult =
  | { ok: true }
  | { ok: false; message: string };

export function useUpdateUsername() {
  const [loading, setLoading] = useState(false);
  const { patch } = useAccount();

  const updateUsername = async (
    username: string
  ): Promise<UpdateUsernameResult> => {
    const trimmed = username.trim();

    if (!trimmed) {
      return { ok: false, message: "名前を入力してください" };
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { ok: false, message: "ログインユーザーがいません" };
      }

      const { error } = await supabase
        .from("accounts")
        .update({ username: trimmed })
        .eq("id", user.id);

      if (error) {
        return { ok: false, message: error.message };
      }

      patch({ username: trimmed });

      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "更新に失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateUsername };
}