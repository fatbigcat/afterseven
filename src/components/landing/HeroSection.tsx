import { motion } from "framer-motion";
import type { Event } from "@/types";
import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  event: Event;
  onReserveClick: () => void;
}

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection({ event, onReserveClick }: HeroSectionProps) {
  const isFullyBooked = event.spots_remaining <= 0;

  return (
    <motion.section
      className="min-h-svh flex flex-col items-center justify-center px-6 text-center"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.p
        variants={fadeUp}
        className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-6"
      >
        Members Only
      </motion.p>

      <motion.h1
        variants={fadeUp}
        className="text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-alabaster mb-4"
      >
        AFTER
        <br />
        SEVEN
      </motion.h1>

      <motion.div variants={fadeUp} className="my-8 sm:my-12">
        <CountdownTimer targetDate={event.event_date} />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-lg sm:text-xl font-semibold text-alabaster/90 uppercase tracking-[0.12em] mb-2"
      >
        {event.title}
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="text-sm text-white/40 uppercase tracking-[0.15em] mb-10"
      >
        {new Date(event.event_date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </motion.p>

      <motion.div variants={fadeUp}>
        {isFullyBooked ? (
          <div className="border border-white/20 px-10 py-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50">
              Fully Booked
            </p>
          </div>
        ) : (
          <button
            onClick={onReserveClick}
            className="group relative bg-alabaster text-black font-bold text-sm uppercase tracking-[0.2em] px-10 py-4 hover:bg-white transition-colors active:scale-[0.98] min-h-[48px]"
          >
            Reserve a Spot
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black group-hover:w-full transition-all duration-300" />
          </button>
        )}
      </motion.div>
    </motion.section>
  );
}
