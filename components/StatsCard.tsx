import { Card } from "@/components/Card";

export function StatsCard() {
    return (
        <Card shimmer={false} className="col-span-6 row-span-4 p-8 flex flex-col justify-between">
            <div className="flex gap-3 mb-8 relative z-20">
                <span className="rounded-full border border-zinc-700 px-4 py-1 text-[10px] text-zinc-400 uppercase tracking-widest">Community</span>
                <span className="rounded-full border border-zinc-700 px-4 py-1 text-[10px] text-zinc-400 uppercase tracking-widest">Alpha v-6</span>
            </div>

            <div className="grid grid-cols-4 gap-8 relative z-20">
                <div>
                    <div className="text-xs text-zinc-500 mb-1">hourly users</div>
                    <div className="text-2xl font-bold text-white font-sora">69.7k</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">gen/hrs</div>
                    <div className="text-2xl font-bold text-white font-sora">12.8k</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">artists</div>
                    <div className="text-2xl font-bold text-white font-sora">2.1k</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">nfts generated</div>
                    <div className="text-2xl font-bold text-white font-sora">$867.9b</div>
                </div>
            </div>
        </Card>
    );
}

