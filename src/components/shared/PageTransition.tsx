import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

export function PageTransition({
  children,
  keyProp,
}: {
  children: ReactNode;
  keyProp: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
