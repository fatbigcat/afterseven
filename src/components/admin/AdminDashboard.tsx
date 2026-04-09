import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";
import type { DashboardData, CreateEventInput } from "@/types";
import { CreateEventForm } from "./CreateEventForm";
import { ReservationTable } from "./ReservationTable";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface AdminDashboardProps {
  onLogout: (reason?: string) => void;
}

async function invokeFunction<T>(fnName: string, body: object): Promise<T> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke<T>(fnName, { body });

  if (error) {
    // FunctionsHttpError carries the Response as context — read the body
    if (error instanceof FunctionsHttpError) {
      const response = error.context as Response;
      let detail: string | undefined;
      try {
        const json = await response.json();
        detail = json.error ?? json.message ?? json.msg;
      } catch {
        /* not JSON */
      }
      throw new Error(detail ?? error.message);
    }
    throw new Error(error.message);
  }

  return data as T;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invokeFunction<DashboardData>(
        "admin-get-dashboard",
        {},
      );
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCreateEvent = async (input: CreateEventInput) => {
    try {
      setActionLoading(true);
      setError(null);
      await invokeFunction("admin-create-event", input);
      await fetchDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create event";
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetEvent = async () => {
    if (!data?.event) return;
    if (
      !confirm(
        "This will delete all reservations and deactivate the event. Continue?",
      )
    )
      return;

    try {
      setActionLoading(true);
      setError(null);
      await invokeFunction("admin-reset-event", {
        event_id: data.event.id,
      });
      await fetchDashboard();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reset event";
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) {
    return <LoadingSpinner className="min-h-svh" />;
  }

  const event = data?.event;
  const reservations = data?.reservations ?? [];
  const totalGuests = reservations.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div className="min-h-svh px-6 py-8 sm:py-12 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-black uppercase tracking-[0.1em] text-alabaster">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-red-500/30 bg-red-500/10 px-4 py-3 mb-6 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Active Event */}
        {event ? (
          <div className="mb-10">
            <div className="border border-white/10 p-6 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-1">
                    Active Event
                  </p>
                  <h2 className="text-lg font-bold text-alabaster">
                    {event.title}
                  </h2>
                </div>
                <button
                  onClick={handleResetEvent}
                  disabled={actionLoading}
                  className="text-xs uppercase tracking-[0.15em] text-red-400 hover:text-red-300 transition-colors border border-red-400/30 px-3 py-1.5"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-4">
                <div>
                  <p className="text-2xl font-bold text-alabaster tabular-nums">
                    {event.spots_remaining}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Spots Left
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-alabaster tabular-nums">
                    {reservations.length}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Reservations
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-alabaster tabular-nums">
                    {totalGuests}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Total Guests
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white/10 p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-alabaster mb-4">
                Reservations
              </h3>
              <ReservationTable reservations={reservations} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 mb-10 border border-white/10">
            <p className="text-sm text-white/40 uppercase tracking-[0.15em]">
              No active event
            </p>
          </div>
        )}

        {/* Create Event */}
        <CreateEventForm
          onSubmit={handleCreateEvent}
          isLoading={actionLoading}
        />
      </motion.div>
    </div>
  );
}
