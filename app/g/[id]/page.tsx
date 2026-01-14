"use client";

import { useHistory } from "@/store/generationHistory";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { View } from "@/types";
import { Download, Share2, Copy, Sparkles, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function GalleryPage() {
    const params = useParams();
    const router = useRouter();
    const { getGeneration } = useHistory();
    const [id, setId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (params.id) {
            setId(params.id as string);
        }
    }, [params]);

    // Retrieve item
    const item = id ? getGeneration(id) : null;

    if (!id) return null;

    if (!item) {
        return (
            <div className="h-screen w-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4 font-outfit">
                <h1 className="text-2xl font-bold">Image Not Found</h1>
                <p className="text-zinc-500">The generation you are looking for does not exist or has been cleared.</p>
                <button
                    onClick={() => router.push('/discover')}
                    className="px-6 py-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                >
                    Back to Discover
                </button>
            </div>
        );
    }

    const copyPrompt = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white font-outfit select-none p-4 gap-4">
            {/* Navbar */}
            <div className="px-4">
                <Navbar currentView={View.DISCOVER} setCurrentView={(view) => {
                    if (view === View.HOME) router.push("/");
                    if (view === View.GENERATE) router.push("/create");
                    if (view === View.DISCOVER) router.push("/discover");
                }} />
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-7xl h-full grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 p-4">

                    {/* Left: Image Canvas */}
                    <div className="relative rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden flex items-center justify-center p-8 shadow-2xl group">
                        <button
                            onClick={() => router.back()}
                            className="absolute top-6 left-6 p-3 rounded-full bg-black/50 hover:bg-zinc-800 text-white backdrop-blur-md border border-white/10 transition-colors z-20"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={item.imageUrl}
                                alt={item.originalPrompt}
                                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            />
                        </div>

                        {/* Floating Actions */}
                        <div className="absolute bottom-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <a
                                href={item.imageUrl}
                                download
                                className="px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </a>
                            <button className="p-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Details Panel */}
                    <div className="h-full rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-8">

                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-bold font-sora text-white mb-2">Generated Details</h1>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                                    {new Date(item.timestamp).toLocaleString()}
                                </p>
                            </div>

                            {/* Original Prompt */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-zinc-400">Original Prompt</h3>
                                    <button
                                        onClick={() => copyPrompt(item.originalPrompt)}
                                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-outfit">
                                    {item.originalPrompt}
                                </div>
                            </div>

                            {/* BetterGLM Prompt */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-blue-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        BetterGLM Prompt
                                    </h3>
                                    <button
                                        onClick={() => copyPrompt(item.betterPrompt)}
                                        className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-sm text-zinc-300 leading-relaxed font-outfit shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                                    {item.betterPrompt}
                                </div>
                            </div>

                            {/* Parameters */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                                <div>
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Ratio</span>
                                    <span className="text-sm font-medium text-white">{item.ratio}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Model</span>
                                    <span className="text-sm font-medium text-white">GLM-Image</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
