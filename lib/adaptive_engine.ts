import { Question, AdaptiveAssessmentState, StopDecision } from './types'
import { questions, getQuestionsByCategory } from './questions'

/**
 * PHASE 3: ALGORITHMIC UPGRADES (PRECISION MODES & TRADE-OFF LOGIC)
 */

/**
 * Main selector function: Determines the next question to ask
 */
export const getNextQuestion = (state: AdaptiveAssessmentState): Question | null => {
    const answeredCount = state.answered_ids.length;

    // 1. Force min floor if in early stage
    const coreQuestions = getQuestionsByCategory('core');
    const remainingCore = coreQuestions.filter(q => !state.answered_ids.includes(q.id));

    if (answeredCount < 10 && remainingCore.length > 0) {
        // Still in core phase: Pick next core question
        return remainingCore[0];
    }

    // 2. Check stop conditions
    const stopDecision = evaluateStopConditions(state);
    if (stopDecision.shouldStop) {
        return null;
    }

    // 3. Adaptive Selection Logic
    return selectBestAdaptiveQuestion(state);
};

/**
 * Evaluates whether the assessment should stop
 */
export const evaluateStopConditions = (state: AdaptiveAssessmentState): StopDecision => {
    const count = state.answered_ids.length;

    // Precision Thresholds
    const isSpeed = state.precision_mode === 'speed';
    const MIN_QUESTIONS = isSpeed ? 10 : 12;
    const MAX_QUESTIONS = isSpeed ? 20 : 25;
    const CONFIDENCE_THRESHOLD = isSpeed ? 0.72 : 0.75;
    const STABILITY_THRESHOLD = isSpeed ? 2 : 3;

    // Floor and Ceiling
    if (count < MIN_QUESTIONS) return { shouldStop: false, reason: 'min_floor' };
    if (count >= MAX_QUESTIONS) return { shouldStop: true, reason: 'max_cap' };

    // Calculate high-level confidence (average of top 3 dimensions)
    const topTraits = [...state.current_traits].sort((a, b) => b.score - a.score).slice(0, 3);
    const avgConfidence = topTraits.reduce((acc, t) => acc + t.confidence, 0) / 3;

    const isHighConfidence = avgConfidence >= CONFIDENCE_THRESHOLD;
    const isStable = state.stability_count >= STABILITY_THRESHOLD;

    if (isHighConfidence && isStable) {
        return { shouldStop: true, reason: 'confidence_met' };
    }

    // AI CLARIFIER TRIGGER: Persistent tie despite stability
    const topTwoDiff = topTraits.length >= 2 ? (topTraits[0].score - topTraits[1].score) : 100;
    if (count >= MIN_QUESTIONS && state.stability_count >= 2 && topTwoDiff < 7 && count < MAX_QUESTIONS - 5) {
        return { shouldStop: false, reason: 'clarifier_needed' };
    }

    return { shouldStop: false, reason: 'gathering_data' };
};

/**
 * Heuristic-based Question Selector
 * Prioritizes: 
 * 1. Forced Trade-off: Questions resolving ties between top dimensions
 * 2. Tie-breaker: Discrimination pairs
 * 3. Uncertainty reduction: Lowest confidence
 */
function selectBestAdaptiveQuestion(state: AdaptiveAssessmentState): Question | null {
    const unanswered = questions.filter(q => !state.answered_ids.includes(q.id) && q.active);
    if (unanswered.length === 0) return null;

    const topTraits = [...state.current_traits].sort((a, b) => b.score - a.score);
    const topTwo = topTraits.slice(0, 2);

    // 1. FORCED TRADE-OFF: Do we have a question that pulls in opposite directions for the top 2?
    // This is most effective for resolving ties.
    if (topTwo.length === 2 && (topTwo[0].score - topTwo[1].score < 15)) {
        const tradeOff = unanswered.find(q => {
            const weights = q.dimensions.filter(d => d.dimension === topTwo[0].dimension || d.dimension === topTwo[1].dimension);
            if (weights.length < 2) return false;

            // Look for relative dominance or explicit dual-discrimination
            return q.discriminatesBetween?.includes(topTwo[0].dimension) && q.discriminatesBetween?.includes(topTwo[1].dimension);
        });
        if (tradeOff) return tradeOff;
    }

    // 2. Tie-breaker check: Discrimination pairs
    if (topTwo.length === 2 && (topTwo[0].score - topTwo[1].score < 10)) {
        const tieBreaker = unanswered.find(q =>
            q.discriminatesBetween?.includes(topTwo[0].dimension) &&
            q.discriminatesBetween?.includes(topTwo[1].dimension)
        );
        if (tieBreaker) return tieBreaker;
    }

    // 3. Uncertainty reduction: Find the dimension with the lowest confidence
    const lowestConfidenceDim = topTraits.sort((a, b) => a.confidence - b.confidence)[0];
    if (lowestConfidenceDim && lowestConfidenceDim.confidence < 0.75) {
        const reducer = unanswered.find(q =>
            q.dimensions.some(d => d.dimension === lowestConfidenceDim.dimension)
        );
        if (reducer) return reducer;
    }

    // 4. Next available Core
    const nextCore = unanswered.find(q => q.category === 'core');
    if (nextCore) return nextCore;

    return unanswered[0]; // Absolute fallback
}
