import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/src/lib/supabase";
import { uriToUint8Array } from "@/src/utils/uriToUnit8Array";

type UploadResult =
  | { ok: true; url: string; path: string; uri: string; contentType: string }
  | { ok: false; message: string };

function guessExt(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/jpeg") return "jpg";
  return "bin";
}

export function useSimpleImageUpload(
  bucket: string,
  options?: { upsert?: boolean }
) {
  const [loading, setLoading] = useState(false);

  const selectAndUploadImage = async (): Promise<UploadResult> => {
    setLoading(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return { ok: false, message: "権限が必要" };

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (picked.canceled) return { ok: false, message: "キャンセル" };

      const asset = picked.assets[0];
      const uri = asset.uri;

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return { ok: false, message: "未ログイン" };

      const bytes = await uriToUint8Array(uri);

      if (bytes.byteLength === 0) {
        return { ok: false, message: "画像データが0バイトです" };
      }

      const contentType = asset.mimeType ?? "application/octet-stream";
      const ext = guessExt(contentType);

      const path =
        options?.upsert
          ? `${user.id}/avatar`
          : `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, bytes, {
          contentType,
          upsert: options?.upsert ?? false,
        });

      if (uploadError) return { ok: false, message: uploadError.message };

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return { ok: true, url: data.publicUrl, path, uri, contentType };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "upload failed" };
    } finally {
      setLoading(false);
    }
  };

  return { loading, selectAndUploadImage };
}