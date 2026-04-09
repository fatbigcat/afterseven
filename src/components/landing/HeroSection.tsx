import { motion } from "framer-motion";
import type { Event } from "@/types";
import { CountdownTimer } from "./CountdownTimer";

// Inline SVG as React component for color control
function AfterSevenLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 382 178"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <g transform="translate(0,178) scale(0.1,-0.1)">
        <path d="M1575 1488 c-4 -13 -46 -102 -92 -198 -84 -174 -143 -309 -143 -329 0 -7 -43 -9 -127 -7 -71 1 -138 -1 -150 -5 -23 -8 -33 -39 -13 -39 6 0 16 -12 22 -27 14 -36 29 -404 17 -419 -5 -6 -7 -18 -4 -26 8 -19 -21 -28 -92 -28 -51 0 -51 0 -67 69 -20 87 -20 144 -1 180 8 16 16 48 17 72 3 44 3 44 -49 41 -28 -2 -61 2 -73 8 -31 17 -36 -10 -15 -99 21 -93 21 -97 -2 -193 -16 -71 -20 -78 -43 -79 -14 -1 -95 -4 -180 -8 -128 -5 -155 -9 -155 -21 0 -12 19 -15 110 -14 291 2 565 12 577 21 27 22 1022 21 1626 -2 318 -12 467 -14 474 -7 19 19 -3 34 -46 30 -41 -3 -41 -3 -44 130 -3 132 -3 132 -30 133 -87 4 -262 0 -272 -6 -7 -4 -11 -43 -10 -113 1 -59 1 -115 1 -124 -1 -14 -10 -18 -36 -18 -55 0 -57 13 -49 260 5 154 4 223 -4 233 -12 14 -177 23 -213 12 -18 -6 -19 -20 -19 -251 0 -244 0 -244 -35 -244 -20 0 -37 6 -43 15 -4 9 -32 22 -62 30 -29 8 -59 20 -67 28 -9 8 -15 52 -20 123 -6 111 -6 111 33 162 21 28 50 67 64 86 14 20 37 41 53 48 15 7 27 19 27 25 0 16 25 13 -183 20 -234 6 -258 0 -204 -59 12 -13 38 -42 57 -64 20 -21 53 -54 74 -72 33 -29 38 -39 41 -85 7 -102 7 -185 2 -195 -13 -21 -131 -44 -224 -44 -52 0 -96 2 -98 4 -5 5 33 247 41 259 5 8 24 130 25 159 1 16 -75 239 -91 269 -6 12 -5 22 3 30 18 18 -11 33 -48 25 -16 -3 -37 -6 -45 -5 -65 6 -65 6 -68 -19 -5 -49 -86 -285 -104 -306 -10 -11 -16 -27 -13 -35 2 -8 9 -45 14 -84 6 -38 17 -108 25 -155 9 -47 16 -98 16 -115 0 -30 0 -30 -93 -27 -94 3 -94 3 -97 160 -7 344 -8 327 18 330 24 4 28 12 12 28 -7 7 -30 8 -67 2 -30 -5 -58 -6 -61 -4 -6 7 22 72 138 316 54 113 100 211 102 219 5 25 -30 24 -37 -1z m281 -367 c1 -14 18 -74 39 -134 21 -59 36 -109 33 -112 -8 -8 -258 -15 -258 -7 0 4 18 62 40 127 22 65 40 126 40 135 0 11 12 15 53 16 50 1 52 0 53 -25z m-539 -205 c3 -3 -65 -191 -90 -246 -13 -30 -37 -93 -52 -140 -29 -89 -40 -110 -58 -110 -7 0 -7 4 1 12 24 24 7 467 -19 476 -5 2 -9 7 -9 10 0 6 220 4 227 -2z m114 -106 c4 -63 7 -172 8 -242 1 -128 1 -128 -61 -129 -35 0 -94 -4 -133 -8 -38 -5 -71 -7 -72 -7 -1 1 18 56 43 122 25 65 67 176 93 246 35 98 51 128 66 131 48 10 50 8 56 -113z m845 114 c82 -7 82 -7 50 -50 -17 -23 -42 -58 -56 -78 -14 -19 -28 -36 -32 -36 -9 0 -158 152 -158 162 0 10 85 10 196 2z m418 -213 c-5 -91 -8 -194 -8 -229 1 -63 1 -63 -80 -60 -81 3 -81 3 -84 231 -2 228 -2 228 89 226 92 -3 92 -3 83 -168z m-764 98 c0 -16 -9 -69 -19 -117 -11 -48 -25 -124 -31 -169 -12 -83 -12 -83 -59 -83 -25 0 -63 -3 -83 -6 -36 -6 -37 -5 -42 27 -2 19 -14 93 -26 164 -36 227 -41 204 48 207 42 2 107 4 145 4 67 1 67 1 67 -27z m-1020 -97 c-13 -45 -22 -62 -30 -62 -5 0 -15 -2 -23 -6 -10 -4 -17 8 -24 45 -10 50 -10 50 31 53 54 4 56 3 46 -30z m2180 -195 c0 -119 0 -119 -31 -113 -17 3 -71 6 -119 6 -87 0 -87 0 -94 107 -4 69 -2 109 4 113 6 4 62 6 125 6 115 0 115 0 115 -119z m-2200 -20 c7 -42 11 -79 9 -81 -2 -2 -21 -6 -41 -9 -44 -7 -46 0 -23 77 8 27 15 63 15 81 0 17 3 35 7 39 10 10 18 -16 33 -107z m1415 -52 c30 -13 30 -13 -7 -14 -48 -1 -75 9 -56 20 17 12 28 11 63 -6z" />
      </g>
    </svg>
  );
}

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
      <motion.div variants={fadeUp} className="mb-6">
        <AfterSevenLogo className="h-24 sm:h-36 w-auto text-alabaster opacity-80" />
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-[clamp(4.75rem,13vw,8.5rem)] font-cometus font-medium leading-[0.85] tracking-[-0.03em] text-alabaster mb-4"
      >
        After
        <br />
        Seven
      </motion.h1>

      <motion.div variants={fadeUp} className="my-8 sm:my-12">
        <CountdownTimer targetDate={event.event_date} />
      </motion.div>

      {/* Event card */}
      <motion.div
        variants={fadeUp}
        className="border border-white/15 px-8 py-6 mb-10 w-full max-w-xs"
      >
        <h2 className="text-sm sm:text-base font-bold text-alabaster uppercase tracking-[0.12em] mb-1">
          {event.title}
        </h2>
        <p className="text-xs text-white/40 uppercase tracking-[0.15em]">
          {new Date(event.event_date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

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
