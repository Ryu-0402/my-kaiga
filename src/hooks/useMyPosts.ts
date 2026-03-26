import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Post } from "@/src/types/post";

export function useMyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPosts([]);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("id, user_id, image_url, image_path, caption, created_at, genre")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts((data as Post[]) ?? []);
    } catch (e: any) {
      console.warn("useMyPosts.refresh error:", e?.message ?? e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { posts, loading, refresh, setPosts };
}