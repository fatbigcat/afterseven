import { useRef } from "react";
import { motion } from "framer-motion";
import type { Event, ReservationInput } from "@/types";
import { ReservationForm } from "./ReservationForm";

interface ReservationSectionProps {
  event: Event;
  onSubmit: (data: ReservationInput) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function ReservationSection({
  event,
  onSubmit,
  isSubmitting,
  error,
}: ReservationSectionProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="min-h-svh flex flex-col items-center justify-center px-6 py-16 sm:py-24 border-t border-white/10"
    >
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-12"
      ></motion.h3>

      <ReservationForm
        spotsRemaining={event.spots_remaining}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </motion.section>
  );
}
