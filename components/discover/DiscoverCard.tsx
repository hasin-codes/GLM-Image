import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import Image from "next/image";

interface DiscoverItem {
    id: string | number;
    image: string;
    prompt: string;
    betterPrompt: string;
    ratio: string;
}

interface DiscoverCardProps {
    item: DiscoverItem;
    onClick: () => void;
}

export function DiscoverCard({ item, onClick }: DiscoverCardProps) {
    const hasRealImage = item.image && !item.image.includes('placeholder');

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer group break-inside-avoid mb-4 border border-zinc-800 bg-zinc-900",
                item.ratio
            )}
        >
            {hasRealImage ? (
                <Image
                    src={item.image}
                    alt={item.prompt.slice(0, 50)}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className={cn(
                    "absolute inset-0 transition-transform duration-700 group-hover:scale-105",
                    typeof item.id === 'number' && item.id % 4 === 0 ? "bg-gradient-to-br from-blue-900 to-indigo-900" :
                        typeof item.id === 'number' && item.id % 4 === 1 ? "bg-gradient-to-br from-cyan-900 to-teal-900" :
                            typeof item.id === 'number' && item.id % 4 === 2 ? "bg-gradient-to-br from-slate-900 to-zinc-900" :
                                "bg-gradient-to-br from-zinc-800 to-zinc-900"
                )}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-xs text-zinc-300 line-clamp-3 font-medium leading-relaxed">
                    {item.prompt}
                </p>
                <div className="mt-2 flex justify-end">
                    <Maximize2 className="h-4 w-4 text-white opacity-80" />
                </div>
            </div>
        </div>
    );
}
