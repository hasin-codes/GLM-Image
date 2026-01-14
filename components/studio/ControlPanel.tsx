"use client";

import { GenerationConfig } from "@/types";
import { Sparkles } from "lucide-react";
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
        <div className="flex flex-col gap-4 lg:gap-6 h-full">

            {/* Prompt Section */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-xs lg:text-sm font-medium text-white">
                        <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
                        Prompt
                    </label>
                    <span className="text-[10px] lg:text-xs text-zinc-600">{config.prompt.length}/500</span>
                </div>
                <textarea
                    className="w-full h-20 lg:h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs lg:text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-blue-500/50 transition-all font-outfit disabled:opacity-50"
                    placeholder="Describe your imagination..."
                    value={config.prompt}
                    onChange={(e) => handleChange("prompt", e.target.value)}
                    maxLength={500}
                    disabled={isGenerating}
                />
            </div>

            {/* Style Section */}
            <div>
                <label className="text-xs lg:text-sm font-medium text-white mb-2 block">Style</label>
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-1.5 lg:gap-2">
                    {STYLES.map((style) => (
                        <button
                            key={style}
                            onClick={() => handleChange("style", style)}
                            disabled={isGenerating}
                            className={`px-2 py-1.5 lg:p-3 rounded-lg border text-[9px] lg:text-sm font-medium transition-all disabled:opacity-50 truncate ${config.style === style
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
            <div>
                <label className="text-xs lg:text-sm font-medium text-white mb-2 block">Ratio</label>
                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {RATIOS.map((ratioStr) => {
                        const compactRatio = ratioStr.split(" ")[0];
                        return (
                            <button
                                key={ratioStr}
                                onClick={() => handleChange("ratio", ratioStr)}
                                disabled={isGenerating}
                                className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg border text-[9px] lg:text-xs font-medium transition-all disabled:opacity-50 ${config.ratio === ratioStr
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200'
                                    : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                                    }`}
                            >
                                <span className="lg:hidden">{compactRatio}</span>
                                <span className="hidden lg:inline">{ratioStr}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Spacer to push footer down - Desktop only */}
            <div className="hidden lg:block lg:flex-1" />

            {/* Footer: BetterGLM + Generate */}
            <div className="flex gap-2 items-stretch">
                {/* BetterGLM Toggle (Compact) */}
                <div className="shrink-0 w-11 h-11 lg:w-auto lg:h-auto lg:px-4 lg:py-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-center lg:gap-3">
                    <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400 fill-blue-500" />
                    <span className="hidden lg:inline text-sm font-medium text-white">BetterGLM</span>
                </div>

                {/* Generate Button */}
                <div className="flex-1">
                    <SignedIn>
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating || !config.prompt.trim()}
                            className={`w-full h-11 lg:h-12 rounded-xl font-medium text-sm lg:text-base flex items-center justify-center gap-2 transition-all ${isGenerating
                                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                                : !config.prompt.trim()
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                                }`}
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Generate</span>
                                    <Sparkles className="h-4 w-4 fill-current opacity-70" />
                                </>
                            )}
                        </button>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="w-full h-11 lg:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium text-sm lg:text-base">
                                Sign In to Generate
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>

        </div>
    );
}
