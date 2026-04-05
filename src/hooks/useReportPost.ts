import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

type ReportPostResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export function useReportPost() {
  const [loading, setLoading] = useState(false);

  const reportPost = async (
    postId: string,
    reason: string = "不適切な投稿の可能性"
  ): Promise<ReportPostResult> => {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        return { ok: false, message: "ログインが必要です" };
      }

      const { error } = await supabase.from("reports").insert({
        post_id: postId,
        reporter_id: user.id,
        reason,
      });

      if (error) {
        return { ok: false, message: error.message };
      }

      return { ok: true, message: "通報を受け付けました" };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "通報に失敗しました" };
    } finally {
      setLoading(false);
    }
  };

  return { reportPost, loading };
}