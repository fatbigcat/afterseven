import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Session } from "@supabase/supabase-js";

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const hydrateSession = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);
      setLoading(false);
    };

    hydrateSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        setLoginError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginLoading(true);
      setLoginError(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Session is set automatically by the SDK and picked up by onAuthStateChange
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = (reason?: string) => {
    setSession(null);
    if (reason) {
      setLoginError(reason);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-svh" />;
  }

  if (!session) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        isLoading={loginLoading}
        error={loginError}
      />
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
