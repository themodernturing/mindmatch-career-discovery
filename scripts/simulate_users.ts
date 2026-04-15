import { Question, ScoreProfile, AdaptiveAssessmentState, TraitUncertainty } from '../lib/types';
import { getNextQuestion } from '../lib/adaptive_engine';
import { applyResponseToState, calculateCurrentProfile, initializeAdaptiveState } from '../lib/scoring';
import { questions } from '../lib/questions';
import * as fs from 'fs';

// --- PERSONA DEFINITIONS ---
type Persona = {
    name: string;
    expectedTraits: Record<string, number>; // expected score 1-5
};

const personas: Record<string, Persona> = {
    AnalyticalResearcher: {
        name: "The Analytical Researcher",
        expectedTraits: { riasec_investigative: 5, strength_analytical_thinking: 5, big5_conscientiousness: 4, riasec_social: 1, riasec_artistic: 2 },
    },
    CreativeDesigner: {
        name: "The Creative Designer",
        expectedTraits: { riasec_artistic: 5, strength_creativity: 5, big5_openness: 5, work_structure: 1 },
    },
    HelperCounselor: {
        name: "The Helper / Counselor",
        expectedTraits: { riasec_social: 5, strength_empathy: 5, big5_agreeableness: 5, motivation_achievement: 3 },
    },
    EntrepreneurLeader: {
        name: "The Entrepreneur / Leader",
        expectedTraits: { riasec_enterprising: 5, strength_leadership: 5, big5_extraversion: 4, motivation_achievement: 5 },
    },
    BuilderOperator: {
        name: "The Builder / Operator",
        expectedTraits: { riasec_realistic: 5, riasec_conventional: 4, work_structure: 5, strength_creativity: 1 },
    },
    BalancedGeneralist: {
        name: "The Balanced Generalist",
        expectedTraits: { riasec_investigative: 3, riasec_social: 3, riasec_artistic: 3, riasec_enterprising: 3, riasec_realistic: 3, riasec_conventional: 3 },
    },
    ContradictoryUser: {
        name: "The Contradictory User",
        expectedTraits: {}, // Handled specially in simulation logic
    }
};

// --- SIMULATION LOGIC ---
function simulateAnswer(persona: Persona, question: Question, questionNumber: number): number {
    if (persona.name === "The Contradictory User") {
        // Alternates between 1 and 5 regardless of question content
        return questionNumber % 2 === 0 ? 5 : 1;
    }

    let totalWeight = 0;
    let weightedScore = 0;

    for (const dim of question.dimensions) {
        const expected = persona.expectedTraits[dim.dimension];
        if (expected !== undefined) {
            weightedScore += expected * Math.abs(dim.weight); // Simplified
            totalWeight += Math.abs(dim.weight);
        }
    }

    if (totalWeight === 0) {
        // No strong opinion on this dimension, return neutral 3
        return 3;
    }

    // Calculate average expected response for the dimensions this question measures
    let avgExpected = Math.round(weightedScore / totalWeight);

    // Add a small amount of realistic random noise (10% chance to deviate by 1)
    if (Math.random() < 0.1) {
        avgExpected += Math.random() > 0.5 ? 1 : -1;
    }

    return Math.max(1, Math.min(5, avgExpected)); // Clamp 1-5
}

function runSimulation(persona: Persona, runs: number = 100) {
    let totalQuestions = 0;
    let totalConfidence = 0;
    const stopReasons: Record<string, number> = {};

    console.log(`\n=== Running Simulation: ${persona.name} (${runs} runs) ===`);

    for (let i = 0; i < runs; i++) {
        let state = initializeAdaptiveState();
        let qCount = 0;
        let stopReason = "unknown";

        while (true) {
            const question = getNextQuestion(state);

            // If null, engine requested stop
            if (!question) {
                // evaluateStopConditions is called inside getNextQuestion, but we need the exact reason
                // For simulation script brevity, we assume the last answered question triggered it
                break;
            }

            qCount++;
            const answer = simulateAnswer(persona, question, qCount);
            state = applyResponseToState(state, question, answer);

            // We need to re-evaluate the strict stop condition to log the reason
            // In reality getNextQuestion returns null on the NEXT loop if we should stop.
        }

        // At the end of the run
        const finalProfile = calculateCurrentProfile(state);
        totalQuestions += qCount;

        // Average confidence of top 3 traits
        const top3 = state.current_traits.sort((a: TraitUncertainty, b: TraitUncertainty) => b.score - a.score).slice(0, 3);
        const avgConf = top3.reduce((acc: number, t: TraitUncertainty) => acc + t.confidence, 0) / (top3.length || 1);
        totalConfidence += avgConf;
    }

    console.log(`Avg Questions: ${(totalQuestions / runs).toFixed(1)}`);
    console.log(`Avg High-Trait Confidence: ${(totalConfidence / runs).toFixed(2)}`);
}

// Run the script
console.log("Starting Phase 1 Engine Validation simulations...");
Object.values(personas).forEach(p => runSimulation(p, 50));
