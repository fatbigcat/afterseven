const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);

async function invokeFn<T>(
  fnName: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {}
): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)."
    );
  }

  const { method = "POST", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (data && typeof data === "object") {
      const typed = data as { error?: string; message?: string; code?: string };
      if (typed.error) throw new Error(typed.error);
      if (typed.message) throw new Error(typed.message);
      if (typed.code) throw new Error(typed.code);
    }
    throw new Error(`Request failed with status ${res.status}`);
  }

  return data as T;
}

export { invokeFn };
