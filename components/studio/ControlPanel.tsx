"use client";

import { GenerationConfig, GenerationStage } from "@/types";
import { Sparkles, Dices, ChevronRight, Wand2 } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface ControlPanelProps {
    config: GenerationConfig;
    setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
    onGenerate: () => void;
    isGenerating: boolean;
}

// Available styles for selection
const STYLES = [
    "3D Render",
    "Photorealistic",
    "Oil Painting",
    "Anime",
    "Watercolor",
    "Digital Art",
    "Concept Art",
    "Cinematic",
];

// Available aspect ratios matching our API mapping
const RATIOS = [
    "1:1 Square",
    "16:9 Cinema",
    "9:16 Portrait",
    "4:3 Standard",
    "3:4 Tall",
    "3:2",
    "2:3",
];

export function ControlPanel({ config, setConfig, onGenerate, isGenerating }: ControlPanelProps) {

    const handleChange = (key: keyof GenerationConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col gap-8 pb-8">

            {/* Prompt Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Prompt
                    </label>
                    <span className="text-xs text-zinc-600">{config.prompt.length}/500</span>
                </div>
                <div className="relative">
                    <textarea
                        className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-outfit disabled:opacity-50"
                        placeholder="Describe your imagination in detail..."
                        value={config.prompt}
                        onChange={(e) => handleChange("prompt", e.target.value)}
                        maxLength={500}
                        disabled={isGenerating}
                    />
                    <button
                        className="absolute bottom-3 right-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        disabled={isGenerating}
                    >
                        <Dices className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Style Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">Style</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((style) => (
                        <button
                            key={style}
                            onClick={() => handleChange("style", style)}
                            disabled={isGenerating}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all disabled:opacity-50 ${config.style === style
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                                }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ratio Section */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-white">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                    {RATIOS.map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => handleChange("ratio", ratio)}
                            disabled={isGenerating}
                            className={`p-2.5 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 ${config.ratio === ratio
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                                }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image Detail Slider Removed */}

            <div className="h-[1px] w-full bg-zinc-800/50" />

            {/* BetterGLM Toggle - Forced On */}
            <div className="w-full p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors group flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Sparkles className="h-4 w-4 fill-blue-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover:text-blue-100">BetterGLM</span>
                        <span className="text-xs text-zinc-500">Enhanced prompt adherence</span>
                    </div>
                </div>
                {/* Toggle Switch (Visual Only - Forced On) */}
                <div className="w-10 h-6 bg-blue-600 rounded-full relative shadow-inner cursor-not-allowed opacity-90">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            </div>

            {/* Generate Button - Auth Gated */}
            <SignedIn>
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || !config.prompt.trim()}
                    className={`mt-4 w-full h-14 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-all group ${isGenerating
                        ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                        : !config.prompt.trim()
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <span>Generate</span>
                            <Sparkles className="h-5 w-5 fill-current opacity-50 group-hover:opacity-100" />
                        </>
                    )}
                </button>
            </SignedIn>

            <SignedOut>
                <SignInButton mode="modal">
                    <button className="mt-4 w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25">
                        <span>Sign In to Generate</span>
                        <Sparkles className="h-5 w-5" />
                    </button>
                </SignInButton>
            </SignedOut>

        </div>
    );
}
