import { ScoreProfile } from './types'

/**
 * LEGACY SCORING (Keep for backward compatibility)
 */
export const calculateScore = (): ScoreProfile => {
  // legacy logic...
  return {
    id: 'legacy',
    user_id: 'legacy',
    assessment_id: 'legacy',
    riasec_realistic: 0,
    riasec_investigative: 0,
    riasec_artistic: 0,
    riasec_social: 0,
    riasec_enterprising: 0,
    riasec_conventional: 0,
    big5_openness: 0,
    big5_conscientiousness: 0,
    big5_extraversion: 0,
    big5_agreeableness: 0,
    big5_emotional_stability: 0,
    strength_analytical_thinking: 0,
    strength_creativity: 0,
    strength_empathy: 0,
    strength_leadership: 0,
    strength_communication: 0,
    strength_organization: 0,
    work_structure: 0,
    work_independence: 0,
    work_pace: 0,
    motivation_achievement: 0,
    motivation_financial: 0,
    motivation_helping: 0,
    motivation_autonomy: 0,
    motivation_creativity: 0,
    motivation_work_life_balance: 0,
    calculated_at: new Date().toISOString()
  }
}
