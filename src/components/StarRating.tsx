import { useState } from "react";
import { cn } from "../lib/cn";

interface Props {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 36 }: Props) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Bewertung">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} Stern${n === 1 ? "" : "e"}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className={cn(
              "transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded",
              filled ? "scale-100" : "scale-90 opacity-70 hover:opacity-100",
              "hover:scale-110"
            )}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "url(#star-grad)" : "none"}
              stroke={filled ? "url(#star-grad)" : "currentColor"}
              strokeWidth={filled ? 0 : 1.5}
              className={filled ? "text-accent-500" : "text-ink-300"}
            >
              <defs>
                <linearGradient id="star-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffcf6b" />
                  <stop offset="1" stopColor="#ff9a1a" />
                </linearGradient>
              </defs>
              <path d="M12 2.5l2.9 6.2 6.6.6-4.9 4.6 1.5 6.6L12 17.3l-6.1 3.2 1.5-6.6L2.5 9.3l6.6-.6L12 2.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
