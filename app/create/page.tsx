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

interface CreatePageProps {
    sessionId?: string;
}

export default function CreatePage({ sessionId }: CreatePageProps) {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { addGeneration } = useHistory();

    // Generation config
    const [config, setConfig] = useState<GenerationConfig>({
        prompt: "",
        style: "3D Render",
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
        <main className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white font-outfit select-none p-4 gap-4">
            {/* Top Navbar */}
            <div className="px-4">
                <Navbar currentView={View.GENERATE} setCurrentView={handleViewChange} />
            </div>

            {/* Main Studio Grid - Floating Layout with Gaps */}
            <div className="flex-1 grid grid-cols-[80px_1fr_400px] gap-4 min-h-0">

                {/* Left Sidebar - Floating Panel */}
                <div className="h-full rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-2xl">
                    <SidebarLeft />
                </div>

                {/* Center Canvas - Floating Panel */}
                <section className="h-full relative flex flex-col rounded-[2rem] border border-white/5 bg-[#050505] overflow-hidden shadow-2xl">
                    <MainCanvas
                        config={config}
                        generationState={generationState}
                        onRetry={handleRetry}
                    />
                </section>

                {/* Right Controls - Floating Panel */}
                <aside className="h-full rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-2xl flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
