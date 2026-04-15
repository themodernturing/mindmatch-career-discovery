import { createClient } from '@/lib/supabase/client'
import { ScoreProfile, AdaptiveAssessmentState } from './types'

interface CareerMatchResult {
  id: string
  match: number
  rank: number
  riasec_profile: { realistic: number; investigative: number; artistic: number; social: number; enterprising: number; conventional: number }
}

export async function saveAssessmentResults(
  scores: ScoreProfile,
  matchedCareers: CareerMatchResult[],
  state: AdaptiveAssessmentState
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 1. Create assessment record
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert({
      user_id: user.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
      total_questions: state.answered_ids.length,
    })
    .select()
    .single()

  if (assessmentError || !assessment) {
    console.error('Error saving assessment:', assessmentError)
    return null
  }

  // 2. Save score profile
  const { data: scoreProfile, error: scoreError } = await supabase
    .from('score_profiles')
    .insert({
      user_id: user.id,
      assessment_id: assessment.id,
      riasec_realistic: scores.riasec_realistic,
      riasec_investigative: scores.riasec_investigative,
      riasec_artistic: scores.riasec_artistic,
      riasec_social: scores.riasec_social,
      riasec_enterprising: scores.riasec_enterprising,
      riasec_conventional: scores.riasec_conventional,
      big5_openness: scores.big5_openness,
      big5_conscientiousness: scores.big5_conscientiousness,
      big5_extraversion: scores.big5_extraversion,
      big5_agreeableness: scores.big5_agreeableness,
      big5_emotional_stability: scores.big5_emotional_stability,
      strength_analytical_thinking: scores.strength_analytical_thinking,
      strength_creativity: scores.strength_creativity,
      strength_leadership: scores.strength_leadership,
      strength_empathy: scores.strength_empathy,
      strength_organization: scores.strength_organization,
      strength_communication: scores.strength_communication,
      work_independence: scores.work_independence,
      work_structure: scores.work_structure,
      work_pace: scores.work_pace,
      motivation_achievement: scores.motivation_achievement,
      motivation_helping: scores.motivation_helping,
      motivation_autonomy: scores.motivation_autonomy,
      motivation_financial: scores.motivation_financial,
      motivation_creativity: scores.motivation_creativity,
      motivation_work_life_balance: scores.motivation_work_life_balance,
    })
    .select()
    .single()

  if (scoreError || !scoreProfile) {
    console.error('Error saving score profile:', scoreError)
    return null
  }

  // 3. Save career matches
  const careerMatchInserts = matchedCareers.slice(0, 10).map((career, index) => ({
    user_id: user.id,
    score_profile_id: scoreProfile.id,
    career_id: career.id,
    overall_match: career.match,
    riasec_score: career.match,
    personality_score: 0,
    strength_score: 0,
    work_style_score: 0,
    motivation_score: 0,
    rank: index + 1,
  }))

  await supabase.from('career_matches').insert(careerMatchInserts)

  return assessment.id
}
