import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";

export type Account = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type AccountContextValue = {
  account: Account | null;
  loading: boolean;
  refresh: () => Promise<void>;
  patch: (p: Partial<Account>) => void;
  setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setAccount(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("id, username, avatar_url, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      setAccount((data as Account) ?? null);
    } catch (e: any) {
      console.warn("AccountProvider.refresh error:", e?.message ?? e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const patch = useCallback((p: Partial<Account>) => {
    setAccount((prev) => (prev ? { ...prev, ...p } : prev));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`accounts:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "accounts",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setAccount(payload.new as Account);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const value = useMemo(
    () => ({ account, loading, refresh, patch, setAccount }),
    [account, loading, refresh, patch]
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}