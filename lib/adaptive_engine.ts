import { Question, AdaptiveAssessmentState, StopDecision } from './types'
import { questions } from './questions'

/**
 * PHASE 3: ALGORITHMIC UPGRADES (PRECISION MODES & TRADE-OFF LOGIC)
 */

// All 6 RIASEC dimensions — every assessment must sample each before stopping
const RIASEC_DIMS = [
    'riasec_realistic', 'riasec_investigative', 'riasec_artistic',
    'riasec_social', 'riasec_enterprising', 'riasec_conventional',
] as const

/**
 * Main selector function: Determines the next question to ask.
 *
 * Priority order (unconditional, runs on every call):
 *   0. RIASEC dimension coverage — if any dimension has < 2 answers, force a question for it NOW.
 *      This runs BEFORE the core-phase cap and BEFORE stop conditions so it cannot be skipped.
 *   1. Core phase (first 10 questions) — after coverage is satisfied for the question count so far.
 *   2. Stop condition check.
 *   3. Adaptive heuristic selection.
 */
export const getNextQuestion = (state: AdaptiveAssessmentState): Question | null => {
    const answeredCount = state.answered_ids.length;
    const allUnanswered = questions.filter(q => !state.answered_ids.includes(q.id) && q.active);

    // ── Priority 0: RIASEC coverage (unconditional) ──────────────────────────
    // If any dimension has fewer than 2 questions answered, immediately find and
    // return an unanswered question that positively weights that dimension.
    // This fires regardless of answeredCount, phase, or stop conditions.
    for (const dim of RIASEC_DIMS) {
        const trait = state.current_traits.find(t => t.dimension === dim);
        const answered = trait ? trait.questions_answered : 0;
        if (answered < 2) {
            const coverageQ = allUnanswered.find(q =>
                q.dimensions.some(d => d.dimension === dim && d.weight > 0)
            );
            if (coverageQ) return coverageQ;
            // If no question exists for this dim, continue — cannot cover it, move on
        }
    }

    // ── Priority 1: Core phase (blind sequential, capped at 10) ──────────────
    // Only runs after all currently-uncovered RIASEC dims are satisfied above.
    // We keep this cap at 10 because coverage already handled the R/C questions.
    if (answeredCount < 10) {
        const remainingCore = questions.filter(
            q => q.category === 'core' && !state.answered_ids.includes(q.id) && q.active
        );
        if (remainingCore.length > 0) return remainingCore[0];
    }

    // ── Priority 2: Stop condition check ─────────────────────────────────────
    const stopDecision = evaluateStopConditions(state);
    if (stopDecision.shouldStop) {
        return null;
    }

    // ── Priority 3: Adaptive heuristic ───────────────────────────────────────
    return selectBestAdaptiveQuestion(state);
};

/**
 * Evaluates whether the assessment should stop
 */
export const evaluateStopConditions = (state: AdaptiveAssessmentState): StopDecision => {
    const count = state.answered_ids.length;

    // Precision Thresholds — raised to ensure enough signal across all dimensions
    const isSpeed = state.precision_mode === 'speed';
    const MIN_QUESTIONS = isSpeed ? 14 : 18;
    const MAX_QUESTIONS = isSpeed ? 22 : 28;
    const CONFIDENCE_THRESHOLD = isSpeed ? 0.72 : 0.75;
    const STABILITY_THRESHOLD = isSpeed ? 2 : 3;

    // Floor and Ceiling
    if (count < MIN_QUESTIONS) return { shouldStop: false, reason: 'min_floor' };
    if (count >= MAX_QUESTIONS) return { shouldStop: true, reason: 'max_cap' };

    // Require at least 2 answered questions per RIASEC dimension before stopping
    const hasFullRiasecCoverage = RIASEC_DIMS.every(dim => {
        const trait = state.current_traits.find(t => t.dimension === dim);
        return trait !== undefined && trait.questions_answered >= 2;
    });
    if (!hasFullRiasecCoverage) return { shouldStop: false, reason: 'gathering_data' };

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
 * Heuristic-based Question Selector (runs after coverage and floor are satisfied)
 * Prioritizes:
 * 1. Forced Trade-off: Questions resolving ties between top 2 dimensions
 * 2. Tie-breaker: Discrimination pairs
 * 3. Uncertainty reduction: Lowest confidence dimension
 * 4. Next available core question
 * 5. Absolute fallback: any unanswered active question
 */
function selectBestAdaptiveQuestion(state: AdaptiveAssessmentState): Question | null {
    const unanswered = questions.filter(q => !state.answered_ids.includes(q.id) && q.active);
    if (unanswered.length === 0) return null;

    const topTraits = [...state.current_traits].sort((a, b) => b.score - a.score);
    const topTwo = topTraits.slice(0, 2);

    // 1. FORCED TRADE-OFF: question that discriminates between the top 2 tied dimensions
    if (topTwo.length === 2 && (topTwo[0].score - topTwo[1].score < 15)) {
        const tradeOff = unanswered.find(q => {
            const weights = q.dimensions.filter(d =>
                d.dimension === topTwo[0].dimension || d.dimension === topTwo[1].dimension
            );
            if (weights.length < 2) return false;
            return (
                q.discriminatesBetween?.includes(topTwo[0].dimension) &&
                q.discriminatesBetween?.includes(topTwo[1].dimension)
            );
        });
        if (tradeOff) return tradeOff;
    }

    // 2. Tie-breaker: any discrimination pair for the top 2
    if (topTwo.length === 2 && (topTwo[0].score - topTwo[1].score < 10)) {
        const tieBreaker = unanswered.find(q =>
            q.discriminatesBetween?.includes(topTwo[0].dimension) &&
            q.discriminatesBetween?.includes(topTwo[1].dimension)
        );
        if (tieBreaker) return tieBreaker;
    }

    // 3. Uncertainty reduction: question for the lowest-confidence dimension
    const lowestConfidenceDim = [...topTraits].sort((a, b) => a.confidence - b.confidence)[0];
    if (lowestConfidenceDim && lowestConfidenceDim.confidence < 0.75) {
        const reducer = unanswered.find(q =>
            q.dimensions.some(d => d.dimension === lowestConfidenceDim.dimension)
        );
        if (reducer) return reducer;
    }

    // 4. Next available core question
    const nextCore = unanswered.find(q => q.category === 'core');
    if (nextCore) return nextCore;

    return unanswered[0]; // Absolute fallback
}
