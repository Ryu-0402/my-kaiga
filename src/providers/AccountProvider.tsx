import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/src/lib/supabase";

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
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        setAccount(null);
        return;
      }

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
  }, []);

  const patch = useCallback((p: Partial<Account>) => {
    setAccount((prev) => (prev ? { ...prev, ...p } : prev));
  }, []);

  // 起動時に1回取得（再起動してもここで復元）
  useEffect(() => {
    refresh();
  }, [refresh]);

  // accounts更新を購読して即反映（Setting→MyPage 即反映の強いやつ）
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) return;

      channel = supabase
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
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

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