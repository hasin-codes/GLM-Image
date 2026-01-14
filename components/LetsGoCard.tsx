import { ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import Link from "next/link";

export function LetsGoCard() {
    return (
        <Card shimmer={false} hoverEffect="scale" className="col-span-1 lg:col-span-2 lg:row-span-4 aspect-square md:h-[200px] lg:h-auto lg:aspect-auto rounded-2xl md:rounded-[2.5rem] relative group cursor-pointer border-none overflow-hidden">

            <Link href="/create" className="absolute inset-0 z-50" aria-label="Go to Studio" />

            {/* Background */}
            <div className="absolute inset-0 bg-zinc-950/80" />

            {/* Glow Effect */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse" />
            <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-20 pointer-events-none">
                <span className="text-lg md:text-xl font-bold text-white font-sora leading-none mb-1 opacity-80">Let's</span>
                <div className="flex items-center gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white font-sora leading-none tracking-tighter">Go</span>
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-blue-500 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
            </div>
        </Card>
    );
}

