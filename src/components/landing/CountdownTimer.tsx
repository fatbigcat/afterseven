import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        key={value}
        initial={{ opacity: 0.6, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl font-cometus font-medium tabular-nums text-alabaster tracking-tight"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(targetDate),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <p className="text-sm uppercase tracking-[0.2em] text-white/50">
        Event has started
      </p>
    );
  }

  return (
    <div className="flex gap-6 sm:gap-10">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-3xl sm:text-5xl font-light text-white/20 self-start">
        :
      </span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-3xl sm:text-5xl font-light text-white/20 self-start">
        :
      </span>
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <span className="text-3xl sm:text-5xl font-light text-white/20 self-start">
        :
      </span>
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}
