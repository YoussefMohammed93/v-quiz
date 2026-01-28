"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  duration = 8,
  borderWidth = 2,
  colorFrom = "#ffc700",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className,
      )}
      style={{
        padding: `${borderWidth}px`,
        // Mask out the center so only the border shows
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
    >
      <div
        className="absolute inset-[-100%] animate-spin"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          // Small segment of color (20 degrees)
          background: `conic-gradient(from 0deg, transparent 0deg, ${colorFrom} 20deg, transparent 40deg)`,
        }}
      />
    </div>
  );
}
