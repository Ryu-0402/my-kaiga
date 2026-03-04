import { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { supabase } from "@/src/lib/supabase";

async function uriToBlob(uri: string): Promise<Blob> {
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return await res.blob();
}

export function useAvatarFlow() {
  const [account, setAccount] = useState<any | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 初期アバター取得
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("accounts")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (data) setAccount(data);
    };

    load();
  }, []);

  // 🔹 選択→アップ→DB更新まで全部
  const selectAndUploadAvatar = async () => {
    setLoading(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("エラー", "権限が必要");
        return;
      }

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (picked.canceled) return;

      const uri = picked.assets[0].uri;
      setLocalUri(uri);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("エラー", "未ログイン");
        return;
      }

      const blob = await uriToBlob(uri);
      const bucket = "avatars";
      const path = `${user.id}/avatar`;

      const { error: upErr } =
        await supabase.storage.from(bucket).upload(path, blob, {
          upsert: true,
        });

      if (upErr) {
        Alert.alert("アップロード失敗", upErr.message);
        return;
      }

      const { data } =
        supabase.storage.from(bucket).getPublicUrl(path);

      const avatarUrl = data.publicUrl;

      const { error: dbErr } = await supabase
        .from("accounts")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (dbErr) {
        Alert.alert("更新失敗", dbErr.message);
        return;
      }

      setAccount({ avatar_url: avatarUrl });

      Alert.alert("成功", "アバター更新した");
    } catch (e: any) {
      Alert.alert("エラー", e?.message ?? "failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 表示用URI（即時反映）
  const avatarUri = useMemo(
    () => localUri ?? account?.avatar_url ?? null,
    [localUri, account]
  );

  return {
    loading,
    avatarUri,
    selectAndUploadAvatar,
  };
}