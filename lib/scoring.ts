import { ScoreProfile, Response, AdaptiveAssessmentState, TraitUncertainty, Question } from './types'
import { getQuestionById } from './questions';

/**
 * PHASE 2: INCREMENTAL SCORING & PRACTICAL UNCERTAINTY MODEL (PUM)
 */

// Target number of questions per dimension for "Full Coverage"
const TARGET_COVERAGE = 4;

/**
 * Initializes a fresh adaptive state
 */
export const initializeAdaptiveState = (): AdaptiveAssessmentState => {
    return {
        version: '2.0-adaptive',
        responses: [],
        current_traits: [],
        answered_ids: [],
        rank_history: [],
        trait_rank_history: [],
        stability_count: 0,
        mode: 'core',
        precision_mode: 'depth' // Default to high precision
    };
};

/**
 * Primary state transition function: Applies a new response and recalculates everything
 */
export const applyResponseToState = (
    state: AdaptiveAssessmentState,
    question: Question,
    responseValue: number
): AdaptiveAssessmentState => {
    const newResponse: Response = {
        id: crypto.randomUUID(),
        assessment_id: '', // Will be set by persistence layer
        question_id: question.id,
        response_value: responseValue,
        response_time_ms: 0, // Default for now
        created_at: new Date().toISOString()
    };

    const updatedResponses = [...state.responses, newResponse];
    const updatedAnsweredIds = [...state.answered_ids, question.id];

    // 1. Recalculate raw traits/scores first
    const currentTraits = calculateTraitUncertainty(updatedResponses, state.trait_rank_history || []);

    // 2. Build current rank snapshot
    const newTraitRank = [...currentTraits]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(t => t.dimension);

    const updatedTraitRankHistory = [...(state.trait_rank_history || []), newTraitRank];

    // 3. Calculate stability (how many times has the top 3 remained the same)
    let stabilityCount = 0;
    if (updatedTraitRankHistory.length > 1) {
        const last = updatedTraitRankHistory[updatedTraitRankHistory.length - 1];
        const prev = updatedTraitRankHistory[updatedTraitRankHistory.length - 2];
        const isSame = last.every((val, index) => last.includes(prev[index]) && prev.includes(val)); // Set equality simplified
        stabilityCount = isSame ? state.stability_count + 1 : 0;
    }

    // 4. Update traits with stability index based on the NEW history
    const finalizedTraits = calculateTraitUncertainty(updatedResponses, updatedTraitRankHistory);

    return {
        ...state,
        responses: updatedResponses,
        answered_ids: updatedAnsweredIds,
        current_traits: finalizedTraits,
        trait_rank_history: updatedTraitRankHistory,
        stability_count: stabilityCount,
        precision_mode: state.precision_mode // Explicitly preserve mode
    };
};

/**
 * Practical Uncertainty Model (PUM)
 * Calculates Score + Confidence based on Coverage, Consistency, and Stability
 */
export function calculateTraitUncertainty(
    responses: Response[],
    traitHistory: string[][]
): TraitUncertainty[] {
    const dimensionData: Record<string, { totalWeight: number; weightedSum: number; values: number[] }> = {};

    // 1. Gather raw sums and values from responses using METADATA
    responses.forEach(resp => {
        const q = getQuestionById(resp.question_id);
        if (!q) return;

        let val = resp.response_value;
        if (q.reverse_scored) val = 6 - val;

        q.dimensions.forEach(dim => {
            if (!dimensionData[dim.dimension]) {
                dimensionData[dim.dimension] = { totalWeight: 0, weightedSum: 0, values: [] };
            }
            dimensionData[dim.dimension].totalWeight += dim.weight;
            dimensionData[dim.dimension].weightedSum += val * dim.weight;
            dimensionData[dim.dimension].values.push(val);
        });
    });

    // 2. Calculate PUM indices for each dimension
    return Object.entries(dimensionData).map(([dim, data]) => {
        const score = (data.weightedSum / (data.totalWeight * 5)) * 100;
        const count = data.values.length;

        // Coverage: How close are we to TARGET_COVERAGE?
        const coverage = Math.min(count / TARGET_COVERAGE, 1.0);

        // Consistency: Standard Deviation across responses (simplified)
        // High variance = low consistency. 
        // If only 1 answer, consistency is 1.0 (optimistic) or 0.5 (neutral)? Let's use 1.0 but coverage will pull it down.
        let consistency = 1.0;
        if (count > 1) {
            const mean = data.values.reduce((a, b) => a + b, 0) / count;
            const variance = data.values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
            // Variance in 1-5 scale can be up to 4. Normalizing to 0-1 consistency index.
            consistency = Math.max(0, 1 - (Math.sqrt(variance) / 2));
        }

        // Stability: Has this dimension moved in/out of top 3 recently?
        // Heuristic: If it was in the top 3 in the last 2 snapshots, it's stable.
        let stability = 0.5; // Neutral start
        if (traitHistory.length >= 2) {
            const inLast = traitHistory[traitHistory.length - 1].includes(dim);
            const inPrev = traitHistory[traitHistory.length - 2].includes(dim);
            stability = (inLast === inPrev) ? 1.0 : 0.2;
        }

        // Combined Confidence Score (weighted heuristic)
        // Coverage is the most important early on.
        const confidence = (coverage * 0.5) + (consistency * 0.3) + (stability * 0.2);

        return {
            dimension: dim,
            score: Math.round(score),
            confidence: parseFloat(confidence.toFixed(2)),
            questions_answered: count,
            coverage_index: coverage,
            consistency_index: consistency,
            stability_index: stability,
            uncertainty: parseFloat((1 - confidence).toFixed(2))
        };
    });
}

/**
 * Compatibility Wrapper: Converts Adaptive State to the legacy ScoreProfile
 * Allows existing results pages to work while back-end is adaptive.
 */
export const calculateCurrentProfile = (state: AdaptiveAssessmentState): ScoreProfile => {
    const profile: Record<string, string | number> = {
        id: crypto.randomUUID(),
        user_id: '',
        assessment_id: '',
        calculated_at: new Date().toISOString()
    };

    // Map TraitUncertainty back to the flat ScoreProfile structure
    state.current_traits.forEach(trait => {
        const col = dimensionToColumn(trait.dimension);
        if (col) profile[col] = trait.score;
    });

    // Fill defaults for missing dimensions.
    // RIASEC dimensions default to 25 (not 50) because an unsampled dimension means
    // "no evidence of interest" — not "moderate interest". Using 50 caused engineering
    // and mechanical careers to score comparably to creative ones for introverted users
    // whose Realistic/Conventional dimensions were never asked due to early termination.
    const riasecColumns = [
        'riasec_realistic', 'riasec_investigative', 'riasec_artistic',
        'riasec_social', 'riasec_enterprising', 'riasec_conventional',
    ];
    const otherColumns = [
        'big5_openness', 'big5_conscientiousness', 'big5_extraversion', 'big5_agreeableness', 'big5_emotional_stability',
        'strength_analytical_thinking', 'strength_creativity', 'strength_leadership', 'strength_empathy', 'strength_organization', 'strength_communication',
        'work_independence', 'work_structure', 'work_pace',
        'motivation_achievement', 'motivation_helping', 'motivation_autonomy', 'motivation_financial', 'motivation_creativity', 'motivation_work_life_balance'
    ];

    riasecColumns.forEach(col => {
        if (profile[col] === undefined) profile[col] = 25; // Low default: no evidence ≠ neutral
    });
    otherColumns.forEach(col => {
        if (profile[col] === undefined) profile[col] = 50; // Neutral default for non-RIASEC
    });


    return profile as unknown as ScoreProfile;
};

/**
 * Legacy Support: Mapping internal dimension names to DB columns
 */
function dimensionToColumn(dimension: string): string | null {
    const mapping: Record<string, string> = {
        riasec_realistic: 'riasec_realistic',
        riasec_investigative: 'riasec_investigative',
        riasec_artistic: 'riasec_artistic',
        riasec_social: 'riasec_social',
        riasec_enterprising: 'riasec_enterprising',
        riasec_conventional: 'riasec_conventional',
        big5_openness: 'big5_openness',
        big5_conscientiousness: 'big5_conscientiousness',
        big5_extraversion: 'big5_extraversion',
        big5_agreeableness: 'big5_agreeableness',
        big5_emotional_stability: 'big5_emotional_stability',
        strength_analytical_thinking: 'strength_analytical_thinking',
        strength_creativity: 'strength_creativity',
        strength_leadership: 'strength_leadership',
        strength_empathy: 'strength_empathy',
        strength_organization: 'strength_organization',
        strength_communication: 'strength_communication',
        work_independence: 'work_independence',
        work_structure: 'work_structure',
        work_pace: 'work_pace',
        motivation_achievement: 'motivation_achievement',
        motivation_helping: 'motivation_helping',
        motivation_autonomy: 'motivation_autonomy',
        motivation_financial: 'motivation_financial',
        motivation_creativity: 'motivation_creativity',
        motivation_work_life_balance: 'motivation_work_life_balance'
    };
    return mapping[dimension] || null;
}

/**
 * UI HELPER: Get top 3 RIASEC codes (e.g., ['R', 'I', 'A'])
 */
export const getTopRIASECCodes = (profile: ScoreProfile): string[] => {
    const riasec = [
        { code: 'R', score: profile.riasec_realistic },
        { code: 'I', score: profile.riasec_investigative },
        { code: 'A', score: profile.riasec_artistic },
        { code: 'S', score: profile.riasec_social },
        { code: 'E', score: profile.riasec_enterprising },
        { code: 'C', score: profile.riasec_conventional },
    ];
    return riasec.sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.code);
};

/**
 * UI HELPER: Get all strengths sorted by score
 */
export const getTopStrengths = (profile: ScoreProfile): { name: string; score: number }[] => {
    const strengths = [
        { name: 'Analytical Thinking', score: profile.strength_analytical_thinking },
        { name: 'Creativity', score: profile.strength_creativity },
        { name: 'Leadership', score: profile.strength_leadership },
        { name: 'Empathy', score: profile.strength_empathy },
        { name: 'Organization', score: profile.strength_organization },
        { name: 'Communication', score: profile.strength_communication },
    ];
    return strengths.sort((a, b) => b.score - a.score);
};

/**
 * UI HELPER: Get all motivations sorted by score
 */
export const getTopMotivations = (profile: ScoreProfile): { name: string; score: number }[] => {
    const motivations = [
        { name: 'Achievement', score: profile.motivation_achievement },
        { name: 'Helping Others', score: profile.motivation_helping },
        { name: 'Autonomy', score: profile.motivation_autonomy },
        { name: 'Financial Reward', score: profile.motivation_financial },
        { name: 'Creative Expression', score: profile.motivation_creativity },
        { name: 'Work-Life Balance', score: profile.motivation_work_life_balance },
    ];
    return motivations.sort((a, b) => b.score - a.score);
};

/**
 * UI HELPER: Get high-level Archetype name
 */
export const getArchetype = (profile: ScoreProfile): string => {
    const codes = getTopRIASECCodes(profile);
    const primary = codes[0];
    const secondary = codes[1];

    const archetypes: Record<string, string> = {
        'RI': 'The Technical Specialist',
        'RA': 'The Creative Engineer',
        'RS': 'The Practical Mentor',
        'RE': 'The Operations Lead',
        'RC': 'The Systems Optimizer',
        'IR': 'The Science Researcher',
        'IA': 'The Theory Architect',
        'IS': 'The Academic Consultant',
        'IE': 'The Strategic Analyst',
        'IC': 'The Data Scientist',
        'AI': 'The UX Designer',
        'AR': 'The Industrial Artist',
        'AS': 'The Social Creative',
        'AE': 'The Creative Director',
        'AC': 'The Digital Architect',
        'SI': 'The Health Researcher',
        'SA': 'The Expressive Counselor',
        'SR': 'The Vocational Teacher',
        'SE': 'The Non-Profit Leader',
        'SC': 'The Services Admin',
        'EI': 'The Venture Analyst',
        'EA': 'The Marketing Strategist',
        'ER': 'The Project Manager',
        'ES': 'The Communications Lead',
        'EC': 'The Business Manager',
        'CI': 'The Systems Analyst',
        'CA': 'The Technical Illustrator',
        'CR': 'The Quality Engineer',
        'CS': 'The Administrative Lead',
        'CE': 'The Operations Manager',
    };

    return archetypes[primary + secondary] || 'The Versatile Professional';
};

/**
 * UI HELPER: Calculate proximity/score for all archetypes
 * Returns top 5 closest archetypes with a 0-100 score
 */
export const getArchetypeProximity = (profile: ScoreProfile): { name: string; score: number }[] => {
    const riasec = [
        { key: 'R', score: profile.riasec_realistic },
        { key: 'I', score: profile.riasec_investigative },
        { key: 'A', score: profile.riasec_artistic },
        { key: 'S', score: profile.riasec_social },
        { key: 'E', score: profile.riasec_enterprising },
        { key: 'C', score: profile.riasec_conventional },
    ].sort((a, b) => b.score - a.score);

    const archetypes: Record<string, string> = {
        'RI': 'The Technical Specialist', 'RA': 'The Creative Engineer', 'RS': 'The Practical Mentor',
        'RE': 'The Operations Lead', 'RC': 'The Systems Optimizer', 'IR': 'The Science Researcher',
        'IA': 'The Theory Architect', 'IS': 'The Academic Consultant', 'IE': 'The Strategic Analyst',
        'IC': 'The Data Scientist', 'AI': 'The UX Designer', 'AR': 'The Industrial Artist',
        'AS': 'The Social Creative', 'AE': 'The Creative Director', 'AC': 'The Digital Architect',
        'SI': 'The Health Researcher', 'SA': 'The Expressive Counselor', 'SR': 'The Vocational Teacher',
        'SE': 'The Non-Profit Leader', 'SC': 'The Services Admin', 'EI': 'The Venture Analyst',
        'EA': 'The Marketing Strategist', 'ER': 'The Project Manager', 'ES': 'The Communications Lead',
        'EC': 'The Business Manager', 'CI': 'The Systems Analyst', 'CA': 'The Technical Illustrator',
        'CR': 'The Quality Engineer', 'CS': 'The Administrative Lead', 'CE': 'The Operations Manager',
    };

    // Calculate a "proximity score" for every archetype based on its primary and secondary components
    return Object.entries(archetypes).map(([key, name]) => {
        const p1 = key[0];
        const p2 = key[1];

        const s1 = riasec.find(r => r.key === p1)?.score || 0;
        const s2 = riasec.find(r => r.key === p2)?.score || 0;

        // Match score is weighted average: 70% primary, 30% secondary
        const score = Math.round((s1 * 0.7) + (s2 * 0.3));

        return { name, score };
    })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Return top 5
};
