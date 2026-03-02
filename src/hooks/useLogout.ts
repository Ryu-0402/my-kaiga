import { useState } from "react";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.replace("/(auth)/login");
    } catch (e: any) {
      console.log("Error signing out:", e?.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  return { onLogout, loading };
};