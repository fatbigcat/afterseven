import { useState, useRef } from "react";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { invokeFn } from "@/lib/api";
import { HeroSection } from "@/components/landing/HeroSection";
import { ReservationSection } from "@/components/landing/ReservationSection";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { ReservationInput, ReservationResult } from "@/types";

interface LandingPageProps {
  onSuccess: (result: ReservationResult) => void;
}

export function LandingPage({ onSuccess }: LandingPageProps) {
  const { event, loading, error: fetchError } = useActiveEvent();
  const [showReservation, setShowReservation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const reservationRef = useRef<HTMLDivElement>(null);

  const handleReserveClick = () => {
    setShowReservation(true);
    setTimeout(() => {
      reservationRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (input: ReservationInput) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      const result = await invokeFn<ReservationResult>("create-reservation", {
        body: input,
      });
      onSuccess(result);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-svh" />;
  }

  if (fetchError) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-alabaster mb-6">
          AFTER
          <br />
          SEVEN
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-red-300/90 max-w-xl">
          {fetchError}
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-alabaster mb-6">
          AFTER
          <br />
          SEVEN
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          No upcoming events
        </p>
      </div>
    );
  }

  return (
    <div>
      <HeroSection event={event} onReserveClick={handleReserveClick} />

      {showReservation && event.spots_remaining > 0 && (
        <div ref={reservationRef}>
          <ReservationSection
            event={event}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            error={submitError}
          />
        </div>
      )}
    </div>
  );
}
