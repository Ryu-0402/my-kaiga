import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/src/lib/supabase";
import { uriToUint8Array } from "@/src/utils/uriToUnit8Array";
import { Genre } from "@/src/constants/genre";

type CreatePostResult =
  | { ok: true }
  | { ok: false; message: string };

export function usePostUpload() {
  const [loading, setLoading] = useState(false);

  const createPost = async (
    genre: Genre,
    caption: string
  ): Promise<CreatePostResult> => {
    const trimmedCaption = caption.trim();

    setLoading(true);

    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        return { ok: false, message: "写真ライブラリの権限が必要です" };
      }

      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (picked.canceled) {
        return { ok: false, message: "画像選択をキャンセルしました" };
      }

      const asset = picked.assets[0];
      const uri = asset.uri;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { ok: false, message: "ログインが必要です" };
      }

      const bytes = await uriToUint8Array(uri);

      if (bytes.byteLength === 0) {
        return { ok: false, message: "画像データが空です" };
      }

      const ext =
        asset.mimeType === "image/png"
          ? "png"
          : asset.mimeType === "image/webp"
          ? "webp"
          : "jpg";

      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(path, bytes, {
          contentType: asset.mimeType ?? "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        return { ok: false, message: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(path);

      const imageUrl = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: imageUrl,
        image_path: path,
        genre: genre,
        caption: trimmedCaption || null,
      });

      if (insertError) {
        return { ok: false, message: insertError.message };
      }

      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "投稿に失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading };
}