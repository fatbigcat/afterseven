import { motion } from "framer-motion";
import type { ReservationResult } from "@/types";

interface SuccessPageProps {
  result: ReservationResult;
}

export function SuccessPage({ result }: SuccessPageProps) {
  const eventDate = new Date(result.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4"
        >
          Reservation Confirmed
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black uppercase tracking-[-0.02em] text-alabaster mb-8"
        >
          See You
          <br />
          After Seven
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="border border-white/15 p-6 sm:p-8 text-left space-y-4 mb-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Event
            </p>
            <p className="text-base text-alabaster font-semibold">
              {result.event_title}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Date
            </p>
            <p className="text-base text-alabaster">{eventDate}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Guests
            </p>
            <p className="text-base text-alabaster">
              {result.party_size} {result.party_size > 1 ? "people" : "person"}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
              Reservation Code
            </p>
            <p className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.15em] text-alabaster">
              {result.reservation_code}
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-white/30 uppercase tracking-[0.15em]"
        >
          A confirmation email has been sent
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-10"
        >
          <a
            href="#/"
            className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors border-b border-white/20 pb-1"
          >
            Back to home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
