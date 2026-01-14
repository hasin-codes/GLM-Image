import Image from "next/image";
import { Card } from "@/components/Card";

export function SideCard() {
    return (
        <Card shimmer={true} className="col-span-4 row-span-8 group relative">
            <Image
                src="/images/dark_warrior.png"
                alt="Top Generation"
                fill
                className="object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 z-20">
                <h2 className="text-3xl font-bold text-white font-sora leading-tight mb-4">
                    Top Generation<br />
                    <span className="text-zinc-400">this WEEK</span>
                </h2>
                <div className="flex gap-2">
                    <span className="rounded-full bg-zinc-800/80 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-md">
                        @user_id
                    </span>
                    <span className="rounded-full bg-zinc-800/80 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-md">
                        Artist
                    </span>
                </div>
            </div>
        </Card>
    );
}

