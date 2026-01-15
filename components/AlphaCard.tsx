import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/Card";
import Link from "next/link";
import dynamic from 'next/dynamic';

const FloatingLines = dynamic(() => import('@/components/FloatingLines'), { ssr: false });

export function AlphaCard() {
    return (
        <Link
            href="https://discord.gg/H3HvMPdc7D"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-1 md:col-span-4 lg:col-span-4 lg:row-span-4 block aspect-square md:h-[250px] md:aspect-auto lg:aspect-auto"
        >
            <Card shimmer={false} hoverEffect="glow" className="h-full p-3 md:p-6 lg:p-8 flex items-center justify-between hover:bg-zinc-900/80 transition-colors relative overflow-hidden">
                {/* FloatingLines Background */}
                <div className="absolute inset-0 z-0 opacity-60">
                    <FloatingLines
                        linesGradient={['#27272a', '#3b82f6', '#60a5fa', '#27272a']}
                        enabledWaves={['middle', 'bottom']}
                        lineCount={[4, 6]}
                        lineDistance={[8, 6]}
                        topWavePosition={{ x: 10.0, y: 0.5, rotate: -0.4 }}
                        middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.2 }}
                        bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
                        animationSpeed={0.8}
                        interactive={true}
                        bendRadius={8}
                        bendStrength={-3}
                        parallax={true}
                        parallaxStrength={0.15}
                        mixBlendMode="screen"
                    />
                </div>

                <div className="flex flex-col gap-1 relative z-20">
                    <div>
                        <h3 className="text-lg md:text-2xl font-bold text-white font-sora leading-tight">Join our Discord</h3>
                        <h3 className="text-lg md:text-2xl font-bold text-zinc-400 font-sora leading-tight">Engage</h3>
                    </div>
                </div>
                <div className="h-10 w-10 md:h-16 md:w-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all relative z-20 flex-shrink-0">
                    <ArrowUpRight className="h-4 w-4 md:h-6 md:w-6" />
                </div>
            </Card>
        </Link>
    );
}
