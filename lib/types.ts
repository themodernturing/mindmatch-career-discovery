// Types for the Career Assessment Platform

export interface User {
  id: string
  email: string
  first_name: string
  age: number
  education_level: string
  created_at: string
}

export interface Assessment {
  id: string
  user_id: string
  status: 'in_progress' | 'completed' | 'paused'
  started_at: string
  completed_at: string | null
  current_section: number
  current_question: number
  total_questions: number
  time_spent_seconds: number
}

export interface Response {
  id: string;
  assessment_id: string;
  question_id: number;
  response_value: number;
  response_time_ms: number;
  is_ai_generated?: boolean; // NEW: For clarifier questions
  created_at: string;
}

export interface ScoreProfile {
  id: string
  user_id: string
  assessment_id: string

  // RIASEC scores
  riasec_realistic: number
  riasec_investigative: number
  riasec_artistic: number
  riasec_social: number
  riasec_enterprising: number
  riasec_conventional: number

  // Big Five
  big5_openness: number
  big5_conscientiousness: number
  big5_extraversion: number
  big5_agreeableness: number
  big5_emotional_stability: number

  // Strengths
  strength_analytical_thinking: number
  strength_creativity: number
  strength_leadership: number
  strength_empathy: number
  strength_organization: number
  strength_communication: number

  // Work Style
  work_independence: number
  work_structure: number
  work_pace: number

  // Motivation
  motivation_achievement: number
  motivation_helping: number
  motivation_autonomy: number
  motivation_financial: number
  motivation_creativity: number
  motivation_work_life_balance: number

  calculated_at: string
}

export interface CareerMatch {
  id: string
  user_id: string
  score_profile_id: string
  career_id: string
  overall_match: number
  riasec_score: number
  personality_score: number
  strength_score: number
  work_style_score: number
  motivation_score: number
  rank: number
  is_saved: boolean
  is_exploring: boolean
  is_pursuing: boolean
  created_at: string
}

export interface Career {
  id: string
  name: string
  category: string
  description: string
  typical_tasks: string[]
  required_skills: { name: string; importance: string; category: string }[]
  education_pathways: { level: string; field: string; duration: string }[]
  riasec_profile: {
    realistic: number
    investigative: number
    artistic: number
    social: number
    enterprising: number
    conventional: number
  }
  salary_range: { entry: number; median: number; experienced: number }
  outlook: { growth: string; demand: string }
}

export interface QuestionDimension {
  dimension: string;
  weight: number;
}

export interface Question {
  id: number;
  text: string;
  section: AssessmentSection;
  category: 'core' | 'branch' | 'clarifier';
  dimensions: QuestionDimension[];
  reverse_scored: boolean;
  active: boolean;
  tags: string[];
  discriminatesBetween?: string[]; // Dimension pairs this question helps resolve
  branchConditions?: {
    minQuestionsAnswered?: number;
    requiresUncertainDimensions?: string[];
    requiresTopDimensions?: string[];
  };
}

// NEW: Adaptive State Models
export interface TraitUncertainty {
  dimension: string;
  score: number; // Normalized 0-100
  confidence: number; // 0-1
  questions_answered: number;
  coverage_index: number;
  consistency_index: number;
  stability_index: number;
  uncertainty: number; // 1 - confidence
}

export interface AdaptiveAssessmentState {
  version: '2.0-adaptive';
  responses: Response[];
  current_traits: TraitUncertainty[];
  answered_ids: number[];
  rank_history: string[][]; // Array of top-3 career IDs at each step
  trait_rank_history?: string[][]; // Array of top-3 trait IDs at each step
  stability_count: number;
  mode: 'core' | 'adaptive' | 'clarifier' | 'completed';
  precision_mode: 'speed' | 'depth'; // NEW: For precision toggle
}

export interface StopDecision {
  shouldStop: boolean;
  reason: 'min_floor' | 'max_cap' | 'confidence_met' | 'gathering_data' | 'low_information_gain' | 'stability_reached' | 'clarifier_needed';
}

// Assessment sections
export type AssessmentSection =
  | 'interest_exploration'
  | 'personality_traits'
  | 'strength_identification'
  | 'work_style_preferences'
  | 'motivation_drivers'
  | 'cognitive_style'

// Likert scale values
export type LikertValue = 1 | 2 | 3 | 4 | 5

export const LIKERT_LABELS: Record<LikertValue, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree'
}
