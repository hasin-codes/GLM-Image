import Image from "next/image";
import { Card } from "@/components/Card";

export function FeaturedCard() {
    return (
        <Card shimmer={true} className="col-span-8 row-span-8 group relative">
            <Image
                src="/images/featured_anime.png"
                alt="Featured Artwork"
                fill
                className="object-cover opacity-90 transition-transform duration-700"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute bottom-8 right-10 text-right z-20">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent font-ariom tracking-tight mb-2">
                    GLM-Image
                </h1>
            </div>
        </Card>
    );
}

