import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "@/pages/LandingPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { AdminPage } from "@/pages/AdminPage";
import type { ReservationResult } from "@/types";
import "./App.css";

function getHash(): string {
  return window.location.hash.slice(1) || "/";
}

function App() {
  const [hash, setHash] = useState(getHash);
  const [reservationResult, setReservationResult] =
    useState<ReservationResult | null>(null);

  useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleReservationSuccess = (result: ReservationResult) => {
    setReservationResult(result);
    window.location.hash = "#/success";
  };

  const page = useMemo(() => {
    if (hash === "/admin") return "admin";
    if (hash === "/success" && reservationResult) return "success";
    return "landing";
  }, [hash, reservationResult]);

  return (
    <div className="app-shell dark">
      {page !== "admin" && (
        <a
          href="#/admin"
          className="admin-entry-link"
          aria-label="Open admin page"
        >
          ✿
        </a>
      )}

      <AnimatePresence mode="wait">
        {page === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onSuccess={handleReservationSuccess} />
          </motion.div>
        )}

        {page === "success" && reservationResult && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SuccessPage result={reservationResult} />
          </motion.div>
        )}

        {page === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPage />
          </motion.div>
        )}
      </AnimatePresence>

      <footer
        className="fixed bottom-0 left-0 py-3 px-4 text-left uppercase text-[10px] tracking-[0.2em] text-white pointer-events-none"
        style={{
          textShadow: "0 3px 15px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,1)",
        }}
      >
        <a
          href="https://instagram.com/sustersickalina"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/95 hover:text-white uppercase transition-colors pointer-events-auto"
        >
          © Kalina
        </a>
      </footer>
    </div>
  );
}

export default App;
