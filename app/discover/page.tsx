"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { View } from "@/types";
import { useRouter } from "next/navigation";
import { DiscoverCard } from "@/components/discover/DiscoverCard";
import { ImageDetailModal } from "@/components/discover/ImageDetailModal";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, Lock, Loader2 } from "lucide-react";

interface DiscoverItem {
    id: string;
    imageUrl: string;
    originalPrompt: string;
    betterPrompt: string;
    aspectRatio: string;
    createdAt: string;
}

interface DiscoverResponse {
    generations: DiscoverItem[];
    total: number;
    page: number;
    hasMore: boolean;
}

export default function DiscoverPage() {
    const router = useRouter();
    const [items, setItems] = useState<DiscoverItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);

    // Fetch public generations from API
    useEffect(() => {
        async function fetchDiscovery() {
            try {
                setLoading(true);
                const res = await fetch('/api/discovery?sort=newest&limit=50');
                if (!res.ok) throw new Error('Failed to fetch');
                const data: DiscoverResponse = await res.json();
                setItems(data.generations);
            } catch (err) {
                setError('Failed to load gallery');
            } finally {
                setLoading(false);
            }
        }
        fetchDiscovery();
    }, []);

    const handleViewChange = (view: View) => {
        if (view === View.HOME) router.push("/");
        if (view === View.GENERATE) router.push("/create");
    };

    // Map aspect ratio to CSS class
    const getRatioClass = (ratio: string) => {
        if (ratio?.includes('16:9')) return 'aspect-video';
        if (ratio?.includes('9:16')) return 'aspect-[9/16]';
        if (ratio?.includes('4:3')) return 'aspect-[4/3]';
        if (ratio?.includes('3:4')) return 'aspect-[3/4]';
        return 'aspect-square';
    };

    return (
        <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white font-outfit select-none p-4 gap-4">
            {/* Navbar */}
            <div className="px-4">
                <Navbar currentView={View.DISCOVER} setCurrentView={handleViewChange} />
            </div>

            <SignedIn>
                <div className="flex-1 rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden relative shadow-2xl">
                    <div className="h-full overflow-y-auto custom-scrollbar p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-zinc-500">
                                {error}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
                                <Sparkles className="h-12 w-12" />
                                <p>No public generations yet. Be the first!</p>
                            </div>
                        ) : (
                            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                                {items.map((item) => (
                                    <DiscoverCard
                                        key={item.id}
                                        item={{
                                            id: item.id as any,
                                            image: item.imageUrl,
                                            prompt: item.originalPrompt,
                                            betterPrompt: item.betterPrompt,
                                            ratio: getRatioClass(item.aspectRatio),
                                        }}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {selectedItem && (
                    <ImageDetailModal
                        item={{
                            id: selectedItem.id as any,
                            image: selectedItem.imageUrl,
                            prompt: selectedItem.originalPrompt,
                            betterPrompt: selectedItem.betterPrompt,
                            ratio: getRatioClass(selectedItem.aspectRatio),
                        }}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </SignedIn>

            <SignedOut>
                <div className="flex-1 rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden relative shadow-2xl flex items-center justify-center">
                    <div className="flex flex-col items-center text-center max-w-md px-6">
                        <div className="h-20 w-20 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                            <Lock className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-sora font-bold text-white mb-3">
                            Sign In to Discover
                        </h2>
                        <p className="text-zinc-500 mb-8">
                            Explore a curated gallery of AI-generated artwork.
                        </p>
                        <SignInButton mode="modal">
                            <button className="px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25">
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
