import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";

export function AlphaCard() {
    return (
        <Card shimmer={false} hoverEffect="glow" className="col-span-4 row-span-4 p-8 flex items-center justify-between hover:bg-zinc-900/80 transition-colors">
            <div className="flex flex-col gap-2 relative z-20">
                <span className="text-zinc-500 text-sm">Alpha test our v-6</span>
                <div>
                    <h3 className="text-2xl font-bold text-white font-sora">Join our team</h3>
                    <h3 className="text-2xl font-bold text-zinc-400 font-sora">Train our AI & earn</h3>
                </div>
            </div>
            <div className="h-16 w-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all relative z-20">
                <ArrowUpRight className="h-6 w-6" />
            </div>
        </Card>
    );
}

