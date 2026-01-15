import Image from "next/image";
import { Card } from "@/components/Card";

export function SideCard() {
    return (
        <Card shimmer={true} className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-8 aspect-square md:h-[300px] md:aspect-auto lg:h-auto lg:aspect-auto group relative">
            <Image
                src="/images/Top.png"
                alt="Top Generation"
                fill
                className="object-cover transition-transform duration-700"
            />
            {/* Enhanced Gradient + Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
            <div className="absolute inset-0 shadow-[inset_0_-20px_40px_rgba(0,0,0,0.8)]" />

            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-20">
                <h2 className="text-[10px] md:text-3xl font-bold text-white font-sora leading-tight mb-2 md:mb-4 drop-shadow-lg">
                    Top Generation<br />
                    <span className="text-zinc-400 text-[8px] md:text-3xl">this WEEK</span>
                </h2>
                <div className="flex gap-1.5 md:gap-2">
                    <span className="rounded-full bg-zinc-800/80 px-2 py-1 md:px-4 md:py-1.5 text-[8px] md:text-xs text-zinc-400 backdrop-blur-md">
                        @hasin-codes
                    </span>
                    <span className="rounded-full bg-zinc-800/80 px-2 py-1 md:px-4 md:py-1.5 text-[8px] md:text-xs text-zinc-400 backdrop-blur-md">
                        Artist
                    </span>
                </div>
            </div>
        </Card>
    );
}

