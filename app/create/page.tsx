"use client";

import { useState, useRef, useEffect } from "react";
import { SidebarLeft } from "@/components/studio/SidebarLeft";
import { ControlPanel } from "@/components/studio/ControlPanel";
import { MainCanvas } from "@/components/studio/MainCanvas";
import { Navbar } from "@/components/Navbar";
import { View, GenerationConfig, GenerationStage, GenerationState } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useHistory } from "@/store/generationHistory";
import { PanelLeft, X } from "lucide-react";

interface CreatePageProps {
    sessionId?: string;
}

export default function CreatePage({ sessionId }: CreatePageProps) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { addGeneration } = useHistory();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Generation config
    const [config, setConfig] = useState<GenerationConfig>({
        prompt: "",
        style: "",
        model: "GLM-Image",
        ratio: "16:9 Cinema",
        detail: 75,
    });

    // Generation state machine
    const [generationState, setGenerationState] = useState<GenerationState>({
        stage: GenerationStage.IDLE,
        result: null,
        error: null,
    });

    // Prevent concurrent generations
    const isGeneratingRef = useRef(false);

    // If sessionId changes, we could load state here
    useEffect(() => {
        if (!sessionId && isGeneratingRef.current) {
            // If we are generating but no session ID, maybe generate one?
            // For now, we just rely on the generate handler to push to new URL
        }
    }, [sessionId]);


    const handleGenerate = async () => {
        // Guard: Already generating
        if (isGeneratingRef.current) {
            console.log('Generation already in progress');
            return;
        }

        // Guard: Not signed in (shouldn't happen with UI gating, but safety check)
        if (!isSignedIn) {
            setGenerationState({
                stage: GenerationStage.ERROR,
                result: null,
                error: 'Please sign in to generate images',
            });
            return;
        }

        // Guard: Empty prompt
        if (!config.prompt.trim()) {
            return;
        }

        // Set lock
        isGeneratingRef.current = true;

        // Create a new Session ID if one doesn't exist
        const currentSessionId = sessionId || crypto.randomUUID();

        // Optimistically update URL to session ID if we aren't there yet
        if (!sessionId) {
            window.history.replaceState(null, '', `/c/${currentSessionId}`);
        }

        try {
            // Stage 1: BetterGLM Optimization
            setGenerationState({
                stage: GenerationStage.OPTIMIZING,
                result: null,
                error: null,
            });

            const optimizeResponse = await fetch('/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: config.prompt,
                    style: config.style,
                }),
            });

            if (!optimizeResponse.ok) {
                const errorData = await optimizeResponse.json();
                throw new Error(errorData.error || 'Failed to optimize prompt');
            }

            const { betterPrompt, originalPrompt } = await optimizeResponse.json();

            // Stage 2: GLM-Image Generation
            setGenerationState({
                stage: GenerationStage.GENERATING,
                result: null,
                error: null,
            });

            const generateResponse = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: betterPrompt,
                    ratio: config.ratio,
                }),
            });

            if (!generateResponse.ok) {
                const errorData = await generateResponse.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const { imageUrl } = await generateResponse.json();

            const result = {
                id: currentSessionId,
                originalPrompt,
                betterPrompt,
                imageUrl,
                ratio: config.ratio,
                timestamp: new Date().toISOString(),
            };

            // Add to history
            addGeneration(result);

            // Complete!
            setGenerationState({
                stage: GenerationStage.COMPLETE,
                result,
                error: null,
            });

        } catch (error) {
            console.error('Generation error:', error);
            setGenerationState({
                stage: GenerationStage.ERROR,
                result: null,
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
            });
        } finally {
            // Release lock
            isGeneratingRef.current = false;
        }
    };

    const handleRetry = () => {
        handleGenerate();
    };

    const handleViewChange = (view: View) => {
        if (view === View.HOME) router.push("/");
        if (view === View.DISCOVER) router.push("/discover");
        if (view === View.GENERATE) router.push("/create");
    };

    const isGenerating = generationState.stage === GenerationStage.OPTIMIZING ||
        generationState.stage === GenerationStage.GENERATING;

    return (
        <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white font-outfit select-none p-2 lg:p-4 gap-2 lg:gap-4">
            {/* Top Navbar */}
            <div className="flex-shrink-0 px-2 lg:px-0">
                <Navbar currentView={View.GENERATE} setCurrentView={handleViewChange} />
            </div>

            {/* Main Studio Grid - Responsive Layout */}
            <div className="flex-1 grid grid-rows-[45%_55%] md:grid-rows-[1fr_400px] lg:grid-rows-1 lg:grid-cols-[80px_1fr_400px] gap-2 lg:gap-4 min-h-0 relative pb-16 lg:pb-0">

                {/* Mobile History Toggle */}
                <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="lg:hidden absolute top-2 left-2 z-30 p-2 bg-zinc-900/80 backdrop-blur rounded-full border border-white/10"
                >
                    <PanelLeft className="h-4 w-4 text-zinc-400" />
                </button>

                {/* Left Sidebar - Floating Panel (Desktop) / Drawer (Mobile) */}
                <div className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/5 transition-transform duration-300 transform
                    lg:static lg:col-start-1 lg:row-span-full lg:h-full lg:transform-none lg:w-auto lg:bg-[#0a0a0a] lg:border lg:border-white/5 lg:rounded-[2rem] lg:overflow-hidden lg:shadow-2xl
                    ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsHistoryOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="h-full pt-16 lg:pt-0">
                        <SidebarLeft
                            onSelectGeneration={(item) => {
                                // Load previous generation into the canvas
                                setGenerationState({
                                    stage: GenerationStage.COMPLETE,
                                    result: {
                                        originalPrompt: item.originalPrompt,
                                        betterPrompt: item.betterPrompt,
                                        imageUrl: item.imageUrl,
                                        ratio: item.aspectRatio,
                                        timestamp: item.createdAt,
                                    },
                                    error: null,
                                });
                                // Update URL to reflect selected generation
                                window.history.replaceState(null, '', `/c/${item.id}`);
                                setIsHistoryOpen(false);
                            }}
                            currentGenerationId={generationState.result?.imageUrl ? sessionId : undefined}
                        />
                    </div>
                </div>

                {/* Overlay for Mobile Drawer */}
                {isHistoryOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsHistoryOpen(false)}
                    />
                )}

                {/* Center Canvas - Row 1 on mobile */}
                <section className="lg:col-start-2 lg:row-auto relative flex flex-col rounded-2xl lg:rounded-[2rem] border border-white/5 bg-[#050505] overflow-hidden shadow-2xl">
                    <MainCanvas
                        config={config}
                        generationState={generationState}
                        onRetry={handleRetry}
                    />
                </section>

                {/* Right Controls - Row 2 on mobile (no scroll) */}
                <aside className="lg:col-start-3 lg:row-auto rounded-2xl lg:rounded-[2rem] border border-white/5 bg-[#0a0a0a] shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-3 lg:p-6 lg:flex-1 lg:overflow-y-auto custom-scrollbar">
                        <ControlPanel
                            config={config}
                            setConfig={setConfig}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>
                </aside>

            </div>
        </main>
    );
}
