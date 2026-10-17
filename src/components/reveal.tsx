"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Content is visible in server HTML; animation is a progressive enhancement. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const element = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={element}
      className={className}
      initial={false}
      whileInView={{ y: 0 }}
      onViewportEnter={() => {
        if (!reducedMotion && element.current) {
          element.current.animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 650,
              delay: delay * 1000,
              easing: "cubic-bezier(0.2, 0.65, 0.3, 1)",
              fill: "backwards",
            },
          );
        }
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
