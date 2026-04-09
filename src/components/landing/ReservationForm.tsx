import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { ReservationInput } from "@/types";

interface ReservationFormProps {
  spotsRemaining: number;
  onSubmit: (data: ReservationInput) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ReservationForm({
  spotsRemaining,
  onSubmit,
  isSubmitting,
  error,
}: ReservationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [partySize, setPartySize] = useState(1);

  const maxParty = Math.min(10, spotsRemaining);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ full_name: fullName, email, party_size: partySize });
  };

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="w-full max-w-md mx-auto"
    >
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <motion.div
          key={spotsRemaining}
          initial={{ scale: 1.15, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block border border-white/20 px-6 py-3"
        >
          <span className="text-2xl sm:text-3xl font-black text-alabaster tabular-nums">
            {spotsRemaining}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 ml-2">
            spots left
          </span>
        </motion.div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div variants={fadeUp} className="mb-6">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mb-8">
          <Label htmlFor="partySize">Number of Guests</Label>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => setPartySize((s) => Math.max(1, s - 1))}
              className="w-12 h-12 border border-white/20 text-alabaster text-lg font-bold hover:border-white/40 transition-colors active:scale-95 flex items-center justify-center"
              disabled={partySize <= 1}
            >
              −
            </button>
            <span className="text-2xl font-bold text-alabaster tabular-nums min-w-[2ch] text-center">
              {partySize}
            </span>
            <button
              type="button"
              onClick={() => setPartySize((s) => Math.min(maxParty, s + 1))}
              className="w-12 h-12 border border-white/20 text-alabaster text-lg font-bold hover:border-white/40 transition-colors active:scale-95 flex items-center justify-center"
              disabled={partySize >= maxParty}
            >
              +
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <motion.div variants={fadeUp}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-alabaster text-black font-bold text-sm uppercase tracking-[0.2em] py-4 hover:bg-white transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {isSubmitting ? (
              <LoadingSpinner className="justify-center" />
            ) : (
              "Confirm Reservation"
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
