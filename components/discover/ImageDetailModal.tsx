import { DiscoverItem } from "@/app/discover/page";
// Re-export check
import { X, Copy, Download, Sparkles } from "lucide-react";

interface ImageDetailModalProps {
    item: DiscoverItem;
    onClose: () => void;
}

export function ImageDetailModal({ item, onClose }: ImageDetailModalProps) {

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Ideally show toast here
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-[85vh] bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Left: Image View */}
                <div className="flex-1 relative bg-zinc-900 flex items-center justify-center p-8 group">
                    <div className="relative w-full h-full max-h-full aspect-auto rounded-xl overflow-hidden shadow-2xl border border-white/5">
                        {/* Placeholder Image styling same as card */}
                        <div className={`w-full h-full bg-gradient-to-br from-blue-900 via-cyan-900 to-black`}>
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </div>

                        {/* Real Download Button positioned on image */}
                        <button className="absolute bottom-6 right-6 px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors shadow-lg flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </button>
                    </div>
                </div>

                {/* Right: Info / Prompts */}
                <div className="w-full md:w-[450px] bg-[#0a0a0a] border-l border-zinc-800 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">

                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold font-sora text-white mb-1">Urban Runner</h2>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Variation 0{item.id + 1}</span>
                    </div>

                    {/* Original Prompt */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium text-zinc-400">Original Prompt</h3>
                            <button
                                onClick={() => copyToClipboard(item.prompt)}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-outfit">
                            {item.prompt}
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
                                onClick={() => copyToClipboard(item.betterPrompt)}
                                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-sm text-zinc-300 leading-relaxed font-outfit shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                            {item.betterPrompt}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
