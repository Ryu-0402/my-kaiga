import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useSimpleImageUpload } from "./useImageUpload";
import { useAccount } from "@/src/providers/AccountProvider";

export function useAvatarFlow() {
  const { loading, selectAndUploadImage } = useSimpleImageUpload("avatars");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { patch } = useAccount();

  const selectAndUploadAvatar = async () => {
    // 1) user
    const { data: { user }, error: uErr } = await supabase.auth.getUser();
    if (uErr || !user) {
      return;
    }

    // 2) 旧avatar_url取得（あれば削除）
    const { data: acc, error: aErr } = await supabase
      .from("accounts")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (aErr) {
      return;
    }

    const oldUrl = acc?.avatar_url ?? null;

    // 3) 新しい画像をアップロード（毎回新しいpath=URLになる）
    const r = await selectAndUploadImage();
    if (!r.ok) {
      return;
    }

    // 4) DB更新（avatar_urlだけ）
    const { error: dbErr } = await supabase
      .from("accounts")
      .update({ avatar_url: r.url })
      .eq("id", user.id);


    // 5) 旧ファイル削除（失敗しても新しいのは残す）
    if (oldUrl) {
      const oldPath = oldUrl.split("/avatars/")[1]; // userId/xxxx.ext
      if (oldPath) {
        const { error: delErr } = await supabase.storage
          .from("avatars")
          .remove([oldPath]);

        if (delErr) console.warn("avatar delete failed:", delErr.message);
      }
    }

    // 6) 即時反映
    setAvatarUri(r.url);
    patch({ avatar_url: r.url});
  };

  return { loading, avatarUri, selectAndUploadAvatar };
}