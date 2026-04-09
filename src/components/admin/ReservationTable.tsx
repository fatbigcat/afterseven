import { useState } from "react";
import { motion } from "framer-motion";
import type { Reservation } from "@/types";

interface ReservationTableProps {
  reservations: Reservation[];
  onCancel?: (reservation: Reservation) => Promise<void>;
}

export function ReservationTable({
  reservations,
  onCancel,
}: ReservationTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (reservations.length === 0) {
    return (
      <div className="border border-white/10 p-8 text-center">
        <p className="text-sm text-white/40 uppercase tracking-[0.15em]">
          No reservations yet
        </p>
      </div>
    );
  }

  const handleCancel = async (r: Reservation) => {
    if (!onCancel) return;
    if (
      !confirm(
        `Cancel reservation for ${r.full_name} (${r.party_size} guest${r.party_size > 1 ? "s" : ""})?`,
      )
    )
      return;
    setCancellingId(r.id);
    try {
      await onCancel(r);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border border-white/10 overflow-x-auto"
    >
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Name
            </th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Email
            </th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Party
            </th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Code
            </th>
            <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium">
              Date
            </th>
            {onCancel && (
              <th className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/40 font-medium"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-4 py-3 text-sm text-alabaster">
                {r.full_name}
              </td>
              <td className="px-4 py-3 text-sm text-white/60">{r.email}</td>
              <td className="px-4 py-3 text-sm text-alabaster tabular-nums">
                {r.party_size}
              </td>
              <td className="px-4 py-3 text-sm font-mono text-white/60 tracking-wider">
                {r.reservation_code}
              </td>
              <td className="px-4 py-3 text-sm text-white/40">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
              {onCancel && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleCancel(r)}
                    disabled={cancellingId === r.id}
                    className="text-xs uppercase tracking-[0.1em] text-red-400/70 hover:text-red-300 transition-colors disabled:opacity-40"
                  >
                    {cancellingId === r.id ? "…" : "Cancel"}
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
