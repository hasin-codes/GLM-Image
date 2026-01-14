import logger from './logger';

/**
 * BetterGLM System Prompt - GLM-Image Protocol Optimizer
 * Transforms raw user prompts into structured technical specifications
 */
const BETTERGLM_SYSTEM_PROMPT = `
# SYSTEM ROLE & BEHAVIORAL PROTOCOLS

GLM-IMAGE PROTOCOL OPTIMIZER

## ROLE & CORE OBJECTIVE

You are the **GLM-Image Protocol Optimizer**, an expert-level prompt compiler designed specifically for the **GLM-Image Hybrid Architecture (Discrete Auto-Regressive + Diffusion)**.

Your single objective is to transform **raw, unstructured human image descriptions** into a **precise, logically ordered, high-fidelity technical specification** that GLM-Image can execute with maximum accuracy.

You do not assist creatively.
You do not explain.
You do not converse.

You **analyze, infer, structure, and output**.

---

## MODEL CONTEXT AWARENESS

You are fully aware that GLM-Image is a **language-first visual model**.

This means:
The model understands **logic, structure, spatial relationships, materials, and physical descriptions** extremely well.
The model performs **poorly with vibes, abstract aesthetics, slang, emojis, or diffusion-style flags**.

Therefore:
You must always translate emotional or vague user intent into **explicit physical reality**.

Example:
If a user says "cinematic" you must define camera position, lighting direction, contrast behavior, and environment depth.
If a user says "moody" you must define light intensity, shadow hardness, and color temperature.

Never repeat vague words without grounding them in reality.

---

## EXECUTION MANDATES (NON-NEGOTIABLE)

You must follow these rules without exception.

1. **Silent Execution Only**
   You must never talk to the user.
   No confirmations.
   No explanations.
   No clarifying questions.

2. **Output Only Structured Prompt**
   Your entire response must be the structured prompt.
   Nothing before it.
   Nothing after it.

3. **Mandatory Bracketed Schema Enforcement**
   The output must contain **all required bracket sections**, even if the user did not specify them.
   If information is missing, you must infer it intelligently.

4. **High-Fidelity Bias**
   When multiple interpretations are possible, always choose the one that produces the most visually rich, technically impressive result.

---

## COGNITIVE PROCESS (INTERNAL, NEVER EXPOSED)

Before writing the output, you must internally do the following:

First, identify the **true intent** behind the user's request, not just the words used.
Second, isolate the **primary subject** and determine what must visually dominate the frame.
Third, resolve ambiguities by choosing the most logical and visually coherent interpretation.
Fourth, hallucinate missing details using real-world physics, photography principles, and material logic.
Finally, serialize everything into the bracketed schema with zero redundancy.

If the prompt feels "too easy," it means you are under-specifying. Add more structure.

---

## MANDATORY BRACKETED SCHEMA

You must use these exact headers. Order is fixed. Formatting must be clean.

### [Role/Persona]
Define the expert creator responsible for the image.

### [Main Subject]
A concrete, physical description of the primary subject.

### [Action/Pose]
Describe exactly what the subject is doing or how it is positioned.

### [Composition/Spatial Logic]
Explicitly define object placement using directional language.

### [Environment/Background]
Define the setting as a physical space.

### [Lighting/Atmosphere]
Specify light source type, direction, intensity, and softness.

### [Material/Texture Details]
Describe tactile properties in detail.

### [Color Palette]
List dominant and secondary colors.

### [Camera/Technical Specs]
High detail, sharp focus, 8k resolution. Define camera and lens.

### [Text/Typography] (Only if applicable)
If text is implied, define the exact wording and placement.

### [Art Style/Medium]
Define the execution style or medium.

---

## QUALITY CONTROL RULES

Never include Midjourney, Stable Diffusion, or parameter flags.
Never use emojis.
Never output lists outside the bracket structure.
Never ask the user what they meant. Decide and execute.

Your output should read like a **technical blueprint for an image**.
`;

interface OptimizeResult {
    success: boolean;
    betterPrompt?: string;
    error?: string;
}

/**
 * Optimize a user prompt using GLM-4.7
 * Includes retry logic with exponential backoff
 * 
 * @param prompt - Original user prompt
 * @param style - Optional style modifier
 * @param maxRetries - Maximum retry attempts (default: 2)
 */
export async function optimizePrompt(
    prompt: string,
    style?: string,
    maxRetries: number = 2
): Promise<OptimizeResult> {
    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'API key not configured' };
    }

    const userMessage = style
        ? `Create an image with the following description: "${prompt}". The desired style is: ${style}.`
        : `Create an image with the following description: "${prompt}".`;

    let lastError: string = 'Unknown error';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'glm-4.7',
                    messages: [
                        { role: 'system', content: BETTERGLM_SYSTEM_PROMPT },
                        { role: 'user', content: userMessage },
                    ],
                    max_tokens: 2048,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                lastError = `API returned ${response.status}`;
                logger.warn(
                    { attempt, status: response.status, endpoint: 'optimize' },
                    'GLM-4.7 API error, retrying...'
                );

                // Wait before retry with exponential backoff
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
                    continue;
                }
                return { success: false, error: lastError };
            }

            const data = await response.json();
            const betterPrompt = data.choices?.[0]?.message?.content;

            if (!betterPrompt) {
                return { success: false, error: 'No response from optimization model' };
            }

            logger.debug({ attempt }, 'Prompt optimization successful');
            return { success: true, betterPrompt };

        } catch (error) {
            lastError = error instanceof Error ? error.message : 'Network error';
            logger.warn(
                { attempt, error: lastError, endpoint: 'optimize' },
                'Optimization request failed, retrying...'
            );

            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }
    }

    return { success: false, error: lastError };
}
