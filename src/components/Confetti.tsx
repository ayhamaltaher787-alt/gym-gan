import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#3a5eff", "#ff9a1a", "#22c55e", "#ec4899", "#8b5cf6", "#f43f5e"];

export default function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 3 + Math.random() * 2.5,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
          }}
          initial={{ y: -40, rotate: p.rot, opacity: 0 }}
          animate={{ y: "110vh", rotate: p.rot + 720, opacity: [0, 1, 1, 0.7, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      ))}
    </div>
  );
}
