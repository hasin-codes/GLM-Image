"use client";
// Force refresh

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { View } from "@/types";
import { useRouter } from "next/navigation";
import { DiscoverCard } from "@/components/discover/DiscoverCard";
import { ImageDetailModal } from "@/components/discover/ImageDetailModal";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, Lock } from "lucide-react";
import { useHistory } from "@/store/generationHistory";

// Demo Data Interface
export interface DiscoverItem {
    id: number;
    image: string;
    prompt: string;
    betterPrompt: string;
    ratio: string;
}

// Generate 18 placeholder items
const DEMO_ITEMS: DiscoverItem[] = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    // Randomizing aspect ratios for masonry feel
    ratio: i % 3 === 0 ? "aspect-[3/4]" : i % 2 === 0 ? "aspect-square" : "aspect-[4/3]",
    image: `/images/discover/placeholder_${i}.jpg`, // We will use a colorful gradient or solid color if image missing
    prompt: "**Urban Runner:** Street-style editorial photo of a stylish athletic man mid-run on an urban asphalt path. He wears a cream Nike hoodie, black running shorts, white Nike cap, white crew socks, and colorful Nike performance sneakers. The background shows a blurred urban city street traffic, pedestrians, and layered buildings adding depth and atmosphere. A sharp beam of late-afternoon golden sunlight cuts across a concrete overpass, casting bold, angular shadows and creating dramatic light contrast. The composition feels fast and fluid: strong motion blur trails from the runner's legs and arms, with the environment slightly streaked from camera panning, evoking high-speed movement. Only parts of the body are crisply lit while others fade into motion, highlighting energy and tension. Shot with a 50mm lens on Kodak Portra 400 film soft grain, warm tones, shallow depth of field. Emphasis on dynamic framing, directional light, visual rhythm, and urban textures. Editorial, cinematic, and kinetic. --ar 2:3 --quality 2 --raw --stylize 200 --v 7",
    betterPrompt: "**Enhanced Urban Runner:** A high-octane editorial capture featuring a dynamic male athlete in motion. Subject is adorned in premium athletic wear: cream hoodie, dark shorts, and distinct performance footwear. The setting is a bustling metropolis, rendered with motion blur to convey speed and urban energy. Lighting is critical—golden hour sun slicing through architectural elements to create deep contrast and angular shadows. The image quality mimics high-end film stock with grain structure and warm color grading. Focus is selective, emphasizing the runner's kinetic energy against the blurred city backdrop."
}));



export default function DiscoverPage() {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);
    const { items: historyItems } = useHistory();

    const handleViewChange = (view: View) => {
        if (view === View.HOME) router.push("/");
        if (view === View.GENERATE) router.push("/create");
    };

    return (
        <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white font-outfit select-none p-4 gap-4">

            {/* Navbar - Floating Top */}
            <div className="px-4">
                <Navbar currentView={View.DISCOVER} setCurrentView={handleViewChange} />
            </div>

            {/* Auth Gated Content */}
            <SignedIn>
                {/* Main Container - Floating Style */}
                <div className="flex-1 rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden relative shadow-2xl">
                    <div className="h-full overflow-y-auto custom-scrollbar p-6">

                        {/* Masonry Grid Layout - CSS Columns */}
                        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                            {/* Show History Items First */}
                            {historyItems.map((item) => (
                                <DiscoverCard
                                    key={item.id}
                                    item={{
                                        id: item.id as any, // Temporary cast as discover uses number IDs currently
                                        image: item.imageUrl,
                                        prompt: item.originalPrompt,
                                        betterPrompt: item.betterPrompt,
                                        ratio: item.ratio,
                                    }}
                                    onClick={() => router.push(`/g/${item.id}`)}
                                />
                            ))}

                            {DEMO_ITEMS.map((item) => (
                                <DiscoverCard
                                    key={item.id}
                                    item={item}
                                    onClick={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>

                    </div>
                </div>

                {/* Detail Modal */}
                {selectedItem && (
                    <ImageDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </SignedIn>

            <SignedOut>
                {/* Sign In Required State */}
                <div className="flex-1 rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden relative shadow-2xl flex items-center justify-center">
                    <div className="flex flex-col items-center text-center max-w-md px-6">
                        <div className="h-20 w-20 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                            <Lock className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-sora font-bold text-white mb-3">
                            Sign In to Discover
                        </h2>
                        <p className="text-zinc-500 mb-8">
                            Explore a curated gallery of AI-generated artwork. Sign in to view creations and get inspired for your next masterpiece.
                        </p>
                        <SignInButton mode="modal">
                            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25">
                                <Sparkles className="h-5 w-5" />
                                Sign In to Continue
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </SignedOut>

        </main>
    );
}
