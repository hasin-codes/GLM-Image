"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string; // For grid positioning (col-span, row-span) and specific dimensions
    shimmer?: boolean;
    hoverEffect?: "scale" | "glow" | "none"; // Option to control hover behavior
    onClick?: () => void;
}

export function Card({
    children,
    className,
    shimmer = false,
    hoverEffect = "none",
    onClick,
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-zinc-950/50 backdrop-blur-sm transition-all duration-500 group",
                // Premium border glow effect on hover (subtle)
                "after:absolute after:inset-0 after:rounded-2xl md:after:rounded-[2.5rem] after:border after:border-white/5 after:transition-colors after:duration-500 hover:after:border-white/10",
                // Hover effects
                hoverEffect === "scale" && "hover:scale-[1.02]",
                hoverEffect === "glow" && "hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]",
                className
            )}
        >
            {/* Background Noise/Texture (Optional for premium feel) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />

            {/* Shimmer Effect - Conditional */}
            {shimmer && (
                <div
                    className="absolute inset-0 z-10 -translate-x-full group-hover:animate-[shimmer_2s_cubic-bezier(0.4,0,0.2,1)_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                    aria-hidden="true"
                />
            )}

            {/* Shimmer Effect - Conditional (Subtle gloss for non-shimmer cards on hover) */}
            {!shimmer && hoverEffect !== "none" && (
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            )}

            {children}
        </div>
    );
}
