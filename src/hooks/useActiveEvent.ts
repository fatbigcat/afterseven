import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/types";

export function useActiveEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }
      setEvent(data ?? null);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Cannot reach Supabase from the browser. Check VITE_SUPABASE_URL / key and network access."
        );
        console.error(err);
        return;
      }

      if (err && typeof err === "object" && "message" in err) {
        const message = String((err as { message: unknown }).message);
        if (message.includes("PGRST205") || message.includes("public.events")) {
          setError("Database is not initialized. Run the initial Supabase migration.");
        } else {
          setError(message);
        }
      } else {
        setError("Failed to load event");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return { event, loading, error, refetch: fetchEvent };
}
