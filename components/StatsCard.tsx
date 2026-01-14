import { Card } from "@/components/Card";

export function StatsCard() {
    return (
        <Card shimmer={false} className="col-span-6 row-span-4 p-8 flex flex-col justify-between">
            <div className="flex gap-3 mb-8 relative z-20">
                <span className="rounded-full border border-zinc-700 px-4 py-1 text-[10px] text-zinc-400 uppercase tracking-widest">Community</span>
                <span className="rounded-full border border-zinc-700 px-4 py-1 text-[10px] text-zinc-400 uppercase tracking-widest">New Drop</span>
            </div>

            <div className="grid grid-cols-4 gap-8 relative z-20">
                <div>
                    <div className="text-xs text-zinc-500 mb-1">hourly users</div>
                    <div className="text-2xl font-bold text-white font-sora">68</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">gen/hrs</div>
                    <div className="text-2xl font-bold text-white font-sora">12.8</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">Impression</div>
                    <div className="text-2xl font-bold text-white font-sora">2.1k</div>
                </div>
                <div>
                    <div className="text-xs text-zinc-500 mb-1">Image generated</div>
                    <div className="text-2xl font-bold text-white font-sora">$867</div>
                </div>
            </div>
        </Card>
    );
}

