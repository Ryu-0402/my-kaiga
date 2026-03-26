// src/hooks/useDeletePost.ts
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

type DeletePostResult =
  | { ok: true }
  | { ok: false; message: string };

export function useDeletePost() {
  const [loading, setLoading] = useState(false);

  const deletePost = async (
    postId: string,
    imagePath: string
  ): Promise<DeletePostResult> => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { ok: false, message: "ログインユーザーがいません" };
      }

      // まず自分の投稿か確認
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select("id, user_id, image_path")
        .eq("id", postId)
        .single();

      if (postError || !post) {
        return { ok: false, message: "投稿が見つかりません" };
      }

      if (post.user_id !== user.id) {
        return { ok: false, message: "自分の投稿しか削除できません" };
      }

      // DBの投稿を削除
      const { error: deleteRowError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteRowError) {
        return { ok: false, message: deleteRowError.message };
      }

      // Storageの画像を削除
      const { error: deleteImageError } = await supabase.storage
        .from("posts")
        .remove([imagePath]);

      if (deleteImageError) {
        return { ok: false, message: deleteImageError.message };
      }

      return { ok: true };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "削除に失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading };
}