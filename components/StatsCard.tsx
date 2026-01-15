import { Card } from "@/components/Card";
import dynamic from 'next/dynamic';

const LiquidChrome = dynamic(() => import('@/components/LiquidChrome'), { ssr: false });

export function StatsCard() {
    return (
        <Card shimmer={false} className="col-span-1 md:col-span-4 lg:col-span-6 lg:row-span-4 aspect-square md:h-auto md:aspect-auto lg:aspect-auto p-3 md:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* LiquidChrome Background */}
            <div className="absolute inset-0 z-0 opacity-60">
                <LiquidChrome
                    baseColor={[0.12, 0.12, 0.14]}
                    accentColor={[0.35, 0.55, 0.85]}
                    speed={0.25}
                    amplitude={0.35}
                    frequencyX={2.0}
                    frequencyY={1.5}
                    interactive={true}
                />
            </div>

            <div className="flex gap-1.5 md:gap-3 mb-2 md:mb-4 lg:mb-8 relative z-20 overflow-hidden">
                <span className="whitespace-nowrap rounded-md md:rounded-full border border-zinc-700 px-2 py-0.5 md:px-4 md:py-1 text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-none bg-zinc-900/50 backdrop-blur-sm">Community</span>
                <span className="whitespace-nowrap rounded-md md:rounded-full border border-zinc-700 px-2 py-0.5 md:px-4 md:py-1 text-[8px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-none bg-zinc-900/50 backdrop-blur-sm">Latest</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 relative z-20">
                <div>
                    <div className="text-[9px] md:text-xs text-zinc-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">hourly users</div>
                    <div className="text-lg md:text-2xl font-bold text-white font-sora drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">68</div>
                </div>
                <div>
                    <div className="text-[9px] md:text-xs text-zinc-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">gen/hrs</div>
                    <div className="text-lg md:text-2xl font-bold text-white font-sora drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">12.8</div>
                </div>
                <div>
                    <div className="text-[9px] md:text-xs text-zinc-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Impression</div>
                    <div className="text-lg md:text-2xl font-bold text-white font-sora drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">2.1k</div>
                </div>
                <div>
                    <div className="text-[9px] md:text-xs text-zinc-400 mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Image gen</div>
                    <div className="text-lg md:text-2xl font-bold text-white font-sora drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">$867</div>
                </div>
            </div>
        </Card>
    );
}
