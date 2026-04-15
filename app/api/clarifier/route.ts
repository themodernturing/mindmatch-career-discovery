import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Schema for the generated question to match our Question interface
const questionSchema = z.object({
    text: z.string().describe('A high-discrimination behavioral question.'),
    section: z.enum([
        'interest_exploration',
        'personality_traits',
        'strength_identification',
        'work_style_preferences',
        'motivation_drivers',
        'cognitive_style'
    ]).describe('The assessment section this question belongs to.'),
    dimensions: z.array(z.object({
        dimension: z.string().describe('The dimension name (e.g., riasec_social).'),
        weight: z.number().describe('Weight from 1-5.')
    })).min(2).max(4).describe('Assign weights to at least 2 dimensions, including the ones being discriminated.'),
    reverse_scored: z.boolean().describe('Whether a high score indicates the opposite of the trait.'),
    tags: z.array(z.string()).describe('Metadata tags.'),
    discriminatesBetween: z.array(z.string()).length(2).describe('The two specific dimensions this question is designed to resolve.')
});

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { tiedDimensions, context } = await req.json();

        const systemPrompt = `You are a world-class psychometrician and behavioral scientist.
Your task is to generate a SINGLE, highly effective behavioral question for a career assessment.

THE PROBLEM:
The user has a "tie" or extreme ambiguity between two traits: ${tiedDimensions[0]} and ${tiedDimensions[1]}.
We need a question that FORCES the user to choose between these two directions, or clearly identifies their dominance in one over the other.

USER CONTEXT (REDUCED PROFILE):
${JSON.stringify(context, null, 2)}

GUIDELINES:
1. Behavioral Rooting: Ask about real-world preferences or actions (e.g., "In a team meeting, I usually..." vs "I prefer to work alone on...").
2. No Overlap: Ensure the question creates a clear binary or pulls the user's focus specifically toward the nuance of these two traits.
3. Tone: Professional, clear, and easy to understand (institutional-grade).
4. Accuracy: Ensure the 'dimensions' and 'weights' you assign are scientifically sound for the question text.
5. Format: Return a structured object matching the schema.`;

        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: questionSchema,
            system: systemPrompt,
            prompt: `Generate a clarifier question to distinguish between ${tiedDimensions[0]} and ${tiedDimensions[1]}.`,
        });

        // Add a temporary ID and category
        const finalizedQuestion = {
            ...object,
            id: Date.now(), // Dynamic ID for transient clarifiers
            category: 'clarifier',
            active: true
        };

        return new Response(JSON.stringify(finalizedQuestion), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Clarifier API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate clarifier question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
