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
    const [showImageModal, setShowImageModal] = useState(false);

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
                        showImageModal={showImageModal}
                        setShowImageModal={setShowImageModal}
                    />
                );
            default:
                return <IdleState />;
        }
    };

    return (
        <div className="relative h-full w-full flex flex-col">
            {/* Top Status Bar - Floating inside canvas */}
            <div className="absolute top-2 left-2 right-2 lg:top-6 lg:left-6 lg:right-6 z-20 flex justify-between items-center pointer-events-none">
                <div className="flex gap-1 lg:gap-2 pointer-events-auto">
                    <StatusPill icon={Box} label={config.model} active />


                    {/* Size/Expand Pill - Clickable when complete */}
                    <div
                        onClick={() => safeState.stage === GenerationStage.COMPLETE && setShowImageModal(true)}
                        className={`transition-opacity ${safeState.stage === GenerationStage.COMPLETE ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-transform' : ''}`}
                    >
                        <StatusPill icon={Maximize2} label={config.ratio} active={safeState.stage === GenerationStage.COMPLETE} />
                    </div>
                </div>
                <button className="hidden lg:flex h-10 w-10 rounded-full bg-zinc-900/80 border border-zinc-800 items-center justify-center text-zinc-400 hover:text-white pointer-events-auto backdrop-blur-md">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Canvas Background - Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-50" />

            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center p-2 lg:p-12 pt-10 lg:pt-12">
                {renderContent()}
            </div>
        </div>
    );
}

// Idle State - Empty canvas
function IdleState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full lg:w-85 lg:h-120 rounded-[2rem] lg:border lg:border-dashed lg:border-zinc-800 lg:bg-zinc-950/30 group">
            {/* "Cards" effect behind - Desktop Only */}
            <div className="hidden lg:block absolute top-2 w-[90%] h-full rounded-[2rem] border border-zinc-800/50 bg-zinc-900/10 -z-10 -rotate-3 transition-transform group-hover:-rotate-6" />
            <div className="hidden lg:block absolute top-1 w-[95%] h-full rounded-[2rem] border border-zinc-800/80 bg-zinc-900/20 -z-10 -rotate-1 transition-transform group-hover:-rotate-2" />

            <div className="h-10 w-10 lg:h-16 lg:w-16 mb-2 lg:mb-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-700 transition-colors shadow-2xl">
                <Sparkles className="h-4 w-4 lg:h-6 lg:w-6" />
            </div>
            <h3 className="text-sm lg:text-xl font-sora font-medium text-white mb-1 lg:mb-2">Start Creating</h3>
            <p className="text-[10px] lg:text-sm text-zinc-500 text-center max-w-40 lg:max-w-50">
                Enter a prompt to generate art
            </p>
        </div>
    );
}

// Stage 1: Optimizing with BetterGLM
function OptimizingState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[95%] max-w-65 lg:max-w-100 h-auto min-h-50 lg:h-120 lg:aspect-auto rounded-[2rem] border border-blue-500/30 bg-blue-950/10 overflow-hidden p-4 lg:p-0">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 via-transparent to-transparent animate-pulse" />

            {/* Orbiting particles */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-full border border-blue-500/20 animate-spin-slow" style={{ animationDuration: '8s' }} />
                <div className="absolute w-24 h-24 lg:w-40 lg:h-40 rounded-full border border-blue-500/10 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="h-10 w-10 lg:h-20 lg:w-20 mb-3 lg:mb-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                    <Sparkles className="h-4 w-4 lg:h-8 lg:w-8 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-base lg:text-xl font-sora font-medium text-white mb-1 lg:mb-2">BetterGLM</h3>
                <p className="text-[10px] lg:text-sm text-blue-300/70 text-center max-w-50 mb-3 lg:mb-6 leading-relaxed">
                    Optimizing prompt...
                </p>

                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] lg:text-xs text-zinc-500 uppercase tracking-widest">Stage 1 of 2</span>
                </div>
            </div>
        </div>
    );
}

// Stage 2: Generating image
function GeneratingState() {
    return (
        <div className="relative flex flex-col items-center justify-center w-[95%] max-w-65 lg:max-w-100 h-auto min-h-50 lg:h-120 lg:aspect-auto rounded-[2rem] border border-cyan-500/30 bg-cyan-950/10 overflow-hidden p-4 lg:p-0">
            {/* Animated gradient sweep */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer-slow" />
            </div>

            {/* Image placeholder with shimmer */}
            <div className="relative w-32.5 h-32.5 lg:w-70 lg:h-70 rounded-2xl bg-zinc-900/50 border border-cyan-500/20 overflow-hidden mb-3 lg:mb-6">
                <div className="absolute inset-0 bg-linear-to-r from-zinc-800/50 via-zinc-700/50 to-zinc-800/50 animate-shimmer" />
                {/* Grid pattern inside */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[1rem_1rem]" />
            </div>

            <h3 className="text-base lg:text-xl font-sora font-medium text-white mb-1 lg:mb-2">Rendering Image</h3>
            <p className="text-[10px] lg:text-sm text-cyan-300/70 text-center max-w-50 mb-3 lg:mb-6 leading-relaxed">
                Creating artwork...
            </p>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] lg:text-xs text-zinc-500 uppercase tracking-widest">Stage 2 of 2</span>
            </div>
        </div>
    );
}

// Error State
function ErrorState({ error, onRetry }: { error: string | null; onRetry?: () => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center w-[90%] max-w-100 h-auto min-h-100 lg:h-120 aspect-square lg:aspect-auto rounded-[2rem] border border-red-500/30 bg-red-950/10 p-6 lg:p-0">
            <div className="h-16 w-16 mb-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-sora font-medium text-white mb-2">Generation Failed</h3>
            <p className="text-sm text-red-300/70 text-center max-w-70 mb-6">
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

// CompleteState - Show generated image
function CompleteState({
    result,
    onCopy,
    copied,
    showImageModal,
    setShowImageModal
}: {
    result: { imageUrl: string; originalPrompt: string; betterPrompt: string };
    onCopy: (text: string) => void;
    copied: boolean;
    showImageModal: boolean;
    setShowImageModal: (show: boolean) => void;
}) {
    const [imageError, setImageError] = useState(false);
    const [activePrompt, setActivePrompt] = useState<'original' | 'better' | null>(null);

    return (
        <>
            {/* Main Container - Absolute fill to prevent pushing */}
            <div className="absolute inset-0 flex flex-row gap-3 lg:gap-6 p-2 lg:p-6 overflow-hidden">
                {/* Left Side: Image Container */}
                <div
                    className="flex-1 relative rounded-2xl lg:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 shadow-2xl group min-w-0 bg-[url('/grid.svg')] flex items-center justify-center p-4 lg:p-6"
                >
                    {/* Expand Icon - Top Right of Container */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowImageModal(true);
                        }}
                        className="absolute top-3 right-3 lg:top-4 lg:right-4 z-30 p-2 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md"
                    >
                        <Maximize2 className="h-4 w-4 lg:h-5 lg:w-5" />
                    </button>

                    {imageError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                            <AlertCircle className="h-6 w-6 lg:h-10 lg:w-10" />
                            <p className="text-[10px] lg:text-sm text-center px-4">Image Error</p>
                        </div>
                    ) : (
                        <img
                            src={result.imageUrl}
                            alt="Generated"
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>

                {/* Right Side: Prompts Buttons - Fixed Width */}
                <div className="w-20 lg:w-30 flex flex-col gap-3 lg:gap-4 shrink-0 h-full justify-center">
                    {/* Original Prompt Button */}
                    <button
                        onClick={() => setActivePrompt('original')}
                        className="w-full aspect-square flex flex-col items-center justify-center gap-1 lg:gap-2 p-1 lg:p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 transition-all group/btn text-center"
                    >
                        <span className="text-[10px] lg:text-xs text-zinc-500 group-hover/btn:text-zinc-300 font-medium leading-tight">
                            Original<br />Prompt
                        </span>
                    </button>

                    {/* BetterGLM Prompt Button */}
                    <button
                        onClick={() => setActivePrompt('better')}
                        className="w-full aspect-square flex flex-col items-center justify-center gap-1 lg:gap-2 p-1 lg:p-2 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all group/btn text-center"
                    >
                        <span className="text-[10px] lg:text-xs text-blue-400/80 group-hover/btn:text-blue-300 font-medium leading-tight">
                            Better<br />GLM
                        </span>
                    </button>
                </div>
            </div>

            {/* Image Modal - Fixed Fullscreen Overlay */}
            {showImageModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-8">
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        onClick={() => setShowImageModal(false)}
                    />
                    <div className="relative w-full max-w-7xl h-[85vh] flex flex-col items-center justify-center pointer-events-none gap-4">
                        <div className="relative w-full flex-1 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex items-center justify-center bg-zinc-900 bg-[url('/grid.svg')]">
                            <img
                                src={result.imageUrl}
                                alt="Full view"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        <div className="flex gap-3 px-6 py-3 rounded-full bg-zinc-900/90 backdrop-blur-md border border-zinc-800 pointer-events-auto shadow-xl">
                            <a
                                href={result.imageUrl}
                                download
                                target="_blank"
                                className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </a>
                            <div className="w-px h-4 bg-zinc-700 my-auto" />
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Prompt Modal - Fixed Fullscreen Overlay */}
            {activePrompt && (
                <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setActivePrompt(null)}
                    />
                    <div className="relative w-full max-w-lg bg-zinc-900 sm:rounded-2xl rounded-t-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in slide-in-from-bottom-4 fade-in duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 shrink-0 rounded-t-2xl">
                            <h3 className="font-sora font-medium text-white flex items-center gap-2">
                                {activePrompt === 'better' ? (
                                    <>
                                        <Sparkles className="h-4 w-4 text-blue-400" />
                                        <span className="text-blue-100">BetterGLM Prompt</span>
                                    </>
                                ) : (
                                    <>
                                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                        <span className="text-zinc-100">Original Prompt</span>
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={() => setActivePrompt(null)}
                                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-37.5">
                            <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap font-light select-text">
                                {activePrompt === 'better' ? result.betterPrompt : result.originalPrompt}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/30 flex justify-between items-center shrink-0 mb-safe">
                            <div className="flex flex-col">
                                {copied ? (
                                    <span className="text-sm text-green-400 flex items-center gap-2 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        Copied to clipboard
                                    </span>
                                ) : (
                                    <span className="text-xs text-zinc-500">
                                        {activePrompt === 'better' ? 'Optimized for best results' : 'Your original input'}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => onCopy(activePrompt === 'better' ? result.betterPrompt : result.originalPrompt)}
                                className={`
                                    px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all
                                    ${activePrompt === 'better'
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'}
                                `}
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function StatusPill({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
    if (!label) return null;
    return (
        <div className={`
             flex items-center gap-1.5 lg:gap-2 px-2.5 py-1.5 lg:px-4 lg:py-2 rounded-full border text-[10px] lg:text-xs font-medium backdrop-blur-md transition-colors
             ${active ? 'bg-zinc-800/80 border-blue-500/30 text-blue-200' : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'}
        `}>
            <Icon className="h-3 w-3" />
            <span className="hidden lg:inline">{label}</span>
        </div>
    )
}
