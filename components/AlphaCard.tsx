import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";
import Link from "next/link";

export function AlphaCard() {
    return (
        <Link
            href="https://discord.gg/H3HvMPdc7D"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-4 row-span-4 block"
        >
            <Card shimmer={false} hoverEffect="glow" className="h-full p-8 flex items-center justify-between hover:bg-zinc-900/80 transition-colors">
                <div className="flex flex-col gap-2 relative z-20">
                    <span className="text-zinc-500 text-sm">Alpha test our v-6</span>
                    <div>
                        <h3 className="text-2xl font-bold text-white font-sora">Join our Discord</h3>
                        <h3 className="text-2xl font-bold text-zinc-400 font-sora">Engage</h3>
                    </div>
                </div>
                <div className="h-16 w-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all relative z-20">
                    <ArrowUpRight className="h-6 w-6" />
                </div>
            </Card>
        </Link>
    );
}

