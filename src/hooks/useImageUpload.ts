import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/src/lib/supabase";
import { Alert } from "react-native";

async function uriToBlob(uri: string): Promise<Blob> {
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return await res.blob();
}

export function useSimpleImageUpload(bucket: string) {
  const [loading, setLoading] = useState(false);

  // 👇 名前を明確に
  const selectAndUploadImage = async () => {
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

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        Alert.alert("エラー", "未ログイン");
        return;
      }

      const blob = await uriToBlob(uri);
      const path = `${user.id}/${Date.now()}`;

      const { error: uploadError } =
        await supabase.storage.from(bucket).upload(path, blob);

      if (uploadError) {
        Alert.alert("アップロード失敗", uploadError.message);
        return;
      }

      const { data } =
        supabase.storage.from(bucket).getPublicUrl(path);

      Alert.alert("成功", "アップロード完了");
      console.log("URL:", data.publicUrl);

    } catch (e: any) {
      Alert.alert("エラー", e?.message ?? "upload failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, selectAndUploadImage };
}