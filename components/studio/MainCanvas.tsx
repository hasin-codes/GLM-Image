import { GenerationConfig, GenerationState, GenerationStage } from "@/types";
import { Sparkles, Maximize2, MoreHorizontal, Box, Wand2, RefreshCw, Download, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";

interface MainCanvasProps {
    config: GenerationConfig;
    generationState: GenerationState;
    onRetry?: () => void;
}

// Default generation state for when prop is undefined
const DEFAULT_GENERATION_STATE: GenerationState = {
    stage: GenerationStage.IDLE,
    result: null,
    error: null,
};

export function MainCanvas({ config, generationState = DEFAULT_GENERATION_STATE, onRetry }: MainCanvasProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Defensive check for undefined generationState
    const safeState = generationState ?? DEFAULT_GENERATION_STATE;

    const renderContent = () => {
        switch (safeState.stage) {
            case GenerationStage.OPTIMIZING:
                return <OptimizingState />;
            case GenerationStage.GENERATING:
                return <GeneratingState />;
            case GenerationStage.ERROR:
                return <ErrorState error={safeState.error} onRetry={onRetry} />;
            case GenerationStage.COMPLETE:
                return (
                    <CompleteState
                        result={safeState.result!}
                        onCopy={copyToClipboard}
                        copied={copied}
                    />
                );
            default:
                return <IdleState />;
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col">
            {/* Top Status Bar - Floating inside canvas */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    <StatusPill icon={Box} label={config.model} active />
                    <StatusPill icon={Wand2} label={config.style} />
                    <StatusPill icon={Maximize2} label={config.ratio} />
                </div>
                <button className="h-10 w-10 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white pointer-events-auto backdrop-blur-md">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Canvas Background - Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-50" />

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-12">
                {renderContent()}
            </div>
        </div>
    );
}

// Idle State - Empty canvas
function IdleState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[340px] h-[480px] rounded-[2rem] border border-dashed border-zinc-800 bg-zinc-950/30 group">
            {/* "Cards" effect behind */}
            <div className="absolute top-2 w-[90%] h-full rounded-[2rem] border border-zinc-800/50 bg-zinc-900/10 -z-10 -rotate-3 transition-transform group-hover:rotate-[-6deg]" />
            <div className="absolute top-1 w-[95%] h-full rounded-[2rem] border border-zinc-800/80 bg-zinc-900/20 -z-10 -rotate-1 transition-transform group-hover:rotate-[-2deg]" />

            <div className="h-16 w-16 mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-colors shadow-2xl">
                <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-sora font-medium text-white mb-2">Start Creating</h3>
            <p className="text-sm text-zinc-500 text-center max-w-[200px]">
                Enter a prompt to generate high-fidelity art
            </p>
        </div>
    );
}

// Stage 1: Optimizing with BetterGLM
function OptimizingState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[400px] h-[480px] rounded-[2rem] border border-blue-500/30 bg-blue-950/10 overflow-hidden">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent animate-pulse" />

            {/* Orbiting particles */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-blue-500/20 animate-spin-slow" style={{ animationDuration: '8s' }} />
                <div className="absolute w-40 h-40 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="h-20 w-20 mb-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                    <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-sora font-medium text-white mb-2">BetterGLM Processing</h3>
                <p className="text-sm text-blue-300/70 text-center max-w-[250px] mb-6">
                    Optimizing your prompt for maximum quality...
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest">Stage 1 of 2</span>
                </div>
            </div>
        </div>
    );
}

// Stage 2: Generating image
function GeneratingState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[400px] h-[480px] rounded-[2rem] border border-cyan-500/30 bg-cyan-950/10 overflow-hidden">
            {/* Animated gradient sweep */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer-slow" />
            </div>

            {/* Image placeholder with shimmer */}
            <div className="relative w-[280px] h-[280px] rounded-2xl bg-zinc-900/50 border border-cyan-500/20 overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/50 via-zinc-700/50 to-zinc-800/50 animate-shimmer" />
                {/* Grid pattern inside */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            </div>

            <h3 className="text-xl font-sora font-medium text-white mb-2">Rendering Image</h3>
            <p className="text-sm text-cyan-300/70 text-center max-w-[250px] mb-6">
                GLM-Image is creating your artwork...
            </p>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Stage 2 of 2</span>
            </div>
        </div>
    );
}

// Error State
function ErrorState({ error, onRetry }: { error: string | null; onRetry?: () => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-[400px] h-[480px] rounded-[2rem] border border-red-500/30 bg-red-950/10">
            <div className="h-16 w-16 mb-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-sora font-medium text-white mb-2">Generation Failed</h3>
            <p className="text-sm text-red-300/70 text-center max-w-[280px] mb-6">
                {error || 'An unexpected error occurred. Please try again.'}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center gap-2 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            )}
        </div>
    );
}

// Complete State - Show generated image
function CompleteState({
    result,
    onCopy,
    copied
}: {
    result: { imageUrl: string; originalPrompt: string; betterPrompt: string };
    onCopy: (text: string) => void;
    copied: boolean;
}) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="relative w-full h-full flex flex-col lg:flex-row gap-8 p-8">
            {/* Generated Image */}
            <div className="flex-1 relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl group flex items-center justify-center p-4">
                {imageError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
                        <AlertCircle className="h-12 w-12" />
                        <p className="text-sm text-center px-4">Image could not be loaded.<br />The link may have expired.</p>
                    </div>
                ) : (
                    <img
                        src={result.imageUrl}
                        alt="Generated"
                        className="w-full h-full object-contain"
                        onError={() => setImageError(true)}
                    />
                )}

                {/* Overlay actions */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                        href={result.imageUrl}
                        download
                        target="_blank"
                        className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </a>
                </div>
            </div>

            {/* Prompts Panel */}
            <div className="w-full lg:w-[320px] flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {/* Original Prompt */}
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Original Prompt</span>
                        <button
                            onClick={() => onCopy(result.originalPrompt)}
                            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                        {result.originalPrompt}
                    </p>
                </div>

                {/* BetterGLM Prompt */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex justify-between items-center mb-2">
                        <span className="flex items-center gap-1.5 text-xs text-blue-400 uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" />
                            BetterGLM Prompt
                        </span>
                        <button
                            onClick={() => onCopy(result.betterPrompt)}
                            className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                        {result.betterPrompt}
                    </p>
                </div>

                {copied && (
                    <div className="text-center text-xs text-green-400 animate-pulse">
                        Copied to clipboard!
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusPill({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
    if (!label) return null;
    return (
        <div className={`
             flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium backdrop-blur-md transition-colors
             ${active ? 'bg-zinc-800/80 border-blue-500/30 text-blue-200' : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'}
        `}>
            <Icon className="h-3 w-3" />
            <span>{label}</span>
        </div>
    )
}
