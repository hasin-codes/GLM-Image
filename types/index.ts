export enum View {
    HOME = 'home',
    DISCOVER = 'discover',
    GENERATE = 'generate',
    ACCOUNT = 'account'
}

export type GenerationConfig = {
    prompt: string;
    style: string;
    model: string;
    ratio: string;
    detail: number;
};

// Generation pipeline stages
export enum GenerationStage {
    IDLE = 'idle',
    OPTIMIZING = 'optimizing',     // Stage 1: BetterGLM processing
    GENERATING = 'generating',      // Stage 2: GLM-Image rendering
    COMPLETE = 'complete',
    ERROR = 'error'
}

// Result from completed generation
export type GenerationResult = {
    originalPrompt: string;
    betterPrompt: string;
    imageUrl: string;
    ratio: string;
    timestamp: string;
};

// Current generation state
export type GenerationState = {
    stage: GenerationStage;
    result: GenerationResult | null;
    error: string | null;
};
