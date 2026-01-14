"use client";

import Image from "next/image";
import { Card } from "@/components/Card";
import { useRef, useState } from "react";

export function FeaturedCard() {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="col-span-2 lg:col-span-8 lg:row-span-8 aspect-[262/109] md:h-[400px] lg:h-auto lg:aspect-auto group relative rounded-2xl md:rounded-[2.5rem] overflow-hidden"
        >
            <Card shimmer={false} className="h-full w-full border-none !p-0 overflow-hidden relative">

                {/* Layer 1: Base Layer (Normal Scale) */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero.png"
                        alt="Featured Artwork Background"
                        fill
                        className="object-cover scale-100"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Layer 2: Magnifying Lens (Zoomed Scale) */}
                <div
                    className="absolute inset-0 z-10 transition-opacity duration-200"
                    style={{
                        maskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black, transparent 98%)`,
                        WebkitMaskImage: `radial-gradient(200px circle at ${position.x}px ${position.y}px, black, transparent 98%)`,
                        opacity: opacity
                    }}
                >
                    <Image
                        src="/images/hero.png"
                        alt="Featured Artwork Magnified"
                        fill
                        className="object-cover scale-125" // Zoom level
                        priority
                    />
                </div>

                {/* Lens Border/Reflections */}
                <div
                    className="absolute z-20 pointer-events-none transition-opacity duration-200"
                    style={{
                        left: position.x,
                        top: position.y,
                        transform: 'translate(-50%, -50%)',
                        width: '400px', // slightly larger than mask
                        height: '400px',
                        borderRadius: '50%',
                        opacity: opacity,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: `
                            inset 0 0 20px rgba(255,255,255,0.2),
                            0 0 20px rgba(255,255,255,0.1)
                        `
                    }}
                />


                {/* Content Overlay */}
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-10 text-right z-30 pointer-events-none mix-blend-screen">
                    <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent font-ariom tracking-tight mb-0 md:mb-2 drop-shadow-[0_2px_10px_rgba(0,0,255,0.5)]">
                        GLM-Image
                    </h1>
                </div>
            </Card>
        </div>
    );
}
