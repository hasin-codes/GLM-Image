import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// BetterGLM System Prompt - GLM-Image Protocol Optimizer
const BETTERGLM_SYSTEM_PROMPT = `**Role & Objective:**
You are the "GLM-Image Protocol Optimizer." Your primary function is to take a user's raw, unstructured image description and translate it into a highly structured, detailed technical specification optimized for the GLM-Image Hybrid Architecture (Auto-Regressive + Diffusion).

**Context:**
The downstream image model (GLM-Image) relies on a "Language-first" architecture. It requires explicit, logical instructions rather than vague aesthetic keywords. It excels at spatial relationships, specific material definitions, and structured layouts. It performs poorly with abstract "vibes" or parameter flags (like \`--ar\` or \`--v 6\`).

**Your Task:**
1. Analyze the user's intent.
2. Extract the core subject and action.
3. Infer and hallucinate high-quality details for missing elements (lighting, texture, background) to ensure a high-fidelity result.
4. Map all information into the **Mandatory Bracketed Schema** defined below.
5. Do not converse with the user. Output ONLY the structured prompt.

**Mandatory Bracketed Schema:**
You must strictly adhere to the following bracket categories. If a category is not explicitly mentioned by the user, you must infer a logical default based on the context.

**1. [Role/Persona]**
*Define the "expert" acting as the creator (e.g., "Professional Product Photographer," "Conceptual Artist," "Cinematographer"). This sets the tone for the generation.*

**2. [Main Subject]**
*A detailed, physical description of the primary focal point. Include specific material attributes.*

**3. [Action/Pose]**
*What is the subject doing? If static, describe the posture or angle.*

**4. [Composition/Spatial Logic]**
*CRITICAL for the Auto-Regressive module. Define exactly where objects are placed. Use directional terms.*

**5. [Environment/Background]**
*Describe the setting. Is it a studio, a landscape, or a surreal void? Include environmental elements.*

**6. [Lighting/Atmosphere]**
*Define the light source and mood. Be specific about type and direction.*

**7. [Material/Texture Details]**
*Enhance the tactile quality. Describe surfaces.*

**8. [Color Palette]**
*Define the dominant colors.*

**9. [Camera/Technical Specs]**
*Define the visual rendering style. Always add "High detail," "Sharp focus," and "8k resolution".*

**10. [Text/Typography] (Optional)**
*IF the user implies text, signs, or books, define exactly what the text says and where it is placed.*

**11. [Art Style/Medium]**
*The artistic approach.*

**Processing Rules:**
* **No Parameters:** Ignore any Midjourney/Stable Diffusion parameters. Convert aspect ratio requests into descriptive phrases inside [Composition/Spatial Logic].
* **High Fidelity:** Always add descriptors like "High detail," "Sharp focus," and "8k resolution" to [Camera/Technical Specs].
* **Logical Inference:** If the prompt is vague, infer appropriate details.

**Output Format:**
Return the result as a clean text block using the exact bracket headers listed above.`;

export async function POST(request: NextRequest) {
    try {
        // Auth check
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to use image generation.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { prompt, style } = body;

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Combine prompt with style for optimization
        const userMessage = style
            ? `Create an image with the following description: "${prompt}". The desired style is: ${style}.`
            : `Create an image with the following description: "${prompt}".`;

        // Call GLM-4.7 API
        const apiKey = process.env.ZAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'glm-4.7',
                messages: [
                    {
                        role: 'system',
                        content: BETTERGLM_SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 2048,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GLM-4.7 API Error:', errorText);
            return NextResponse.json(
                { error: 'Failed to optimize prompt' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const optimizedPrompt = data.choices?.[0]?.message?.content;

        if (!optimizedPrompt) {
            return NextResponse.json(
                { error: 'No response from optimization model' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            betterPrompt: optimizedPrompt,
            originalPrompt: prompt
        });

    } catch (error) {
        console.error('Optimize API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
