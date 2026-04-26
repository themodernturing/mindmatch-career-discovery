"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getTopRIASECCodes, getTopStrengths, getTopMotivations, getArchetype, getArchetypeProximity, initializeAdaptiveState, applyResponseToState, calculateCurrentProfile } from '@/lib/scoring'
import { getNextQuestion, evaluateStopConditions } from '@/lib/adaptive_engine'
import { careers } from '@/lib/careers'
import { ScoreProfile, AdaptiveAssessmentState, Question, TraitUncertainty, Career, StopDecision } from '@/lib/types'
import { ResultsDashboard } from '@/components/ResultsDashboard'
import { createClient } from '@/lib/supabase/client'
import { saveAssessmentResults } from '@/lib/saveResults'
import { onetQuestions, scoreOnetResponses } from '@/lib/onet_questions'

import {
  Brain,
  Sparkles,
  ChevronRight,
  BarChart3,
  Briefcase,
  Zap,
  ShieldCheck,
  Microscope,
  GraduationCap
} from 'lucide-react'

const ENABLE_GOOGLE = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'

type Step = 'landing' | 'onboarding' | 'welcome' | 'assessment' | 'transition' | 'bridge' | 'results' | 'onet_assessment'
type UserStage = 'school' | 'university'

function UserAvatar({ authUser, showMenu, setShowMenu, onLogout }: {
  authUser: { name: string; avatar?: string | null }
  showMenu: boolean
  setShowMenu: (v: boolean) => void
  onLogout: () => void
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 bg-white/8 hover:bg-white/12 border border-white/10 transition-all"
      >
        {authUser.avatar
          ? <img src={authUser.avatar} className="w-6 h-6 rounded-full" alt="" />
          : <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">{authUser.name[0]?.toUpperCase()}</div>
        }
        <span className="text-white text-xs font-semibold">{authUser.name}</span>
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-10 z-50 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl p-2 min-w-[160px]">
            <p className="text-xs text-slate-500 px-3 py-2 border-b border-white/8 mb-1">Signed in as<br /><span className="text-white font-semibold">{authUser.name}</span></p>
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const supabase = createClient()

  const [step, setStep] = useState<Step>('landing')
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveAssessmentState>(initializeAdaptiveState())
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentValue, setCurrentValue] = useState(3)
  const [scores, setScores] = useState<ScoreProfile | null>(null)
  const [matchedCareers, setMatchedCareers] = useState<(Career & { match: number; rank: number })[]>([])
  const [lastStopDecision, setLastStopDecision] = useState<StopDecision | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [isCoachOpen, setIsCoachOpen] = useState(false)
  const [precisionMode, setPrecisionMode] = useState<'speed' | 'depth'>('depth')
  const [isGeneratingClarifier, setIsGeneratingClarifier] = useState(false)
  const [hasSavedSession, setHasSavedSession] = useState(false)
  const [showClinicalAudit, setShowClinicalAudit] = useState(false)
  const [isSavingResults, setIsSavingResults] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [pendingCompletionState, setPendingCompletionState] = useState<AdaptiveAssessmentState | null>(null)
  const [userName, setUserName] = useState('')
  const [userAge, setUserAge] = useState('')
  const [userGender, setUserGender] = useState('')
  const [userSchool, setUserSchool] = useState('')
  const [userGoals, setUserGoals] = useState('')
  const [userStage, setUserStage] = useState<UserStage>('school')
  const [authUser, setAuthUser] = useState<{ id: string; name: string; email?: string; avatar?: string | null } | null>(null)

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isReturningUser, setIsReturningUser] = useState(false)

  // O*NET Interest Profiler state
  const [onetCurrentIndex, setOnetCurrentIndex] = useState(0)
  const [onetResponses, setOnetResponses] = useState<Record<number, number>>({})
  const [onetCurrentValue, setOnetCurrentValue] = useState(3)
  const [onetScores, setOnetScores] = useState<Record<string, number> | null>(null)
  const [showDimensionReveal, setShowDimensionReveal] = useState(false)
  const [revealDimension, setRevealDimension] = useState('')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setUserName('')
    setOnetScores(null)
    localStorage.removeItem('mind_match_onet_scores')
    setStep('landing')
    setShowUserMenu(false)
  }

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  // 0. Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Redirect institution admins immediately — they don't use this page
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'institution') {
          window.location.href = '/institution'
          return
        }

        const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Student'
        const avatar = user.user_metadata?.avatar_url || null
        setAuthUser({ id: user.id, name, email: user.email, avatar })
        setUserName(name)

        // Check for in-progress session (30-day expiry)
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
        const saved = localStorage.getItem('mind_match_session')
        const sessionTs = localStorage.getItem('mind_match_session_ts')
        const sessionValid = saved && sessionTs && (Date.now() - parseInt(sessionTs)) < THIRTY_DAYS

        if (sessionValid) {
          try {
            const parsed = JSON.parse(saved!) as AdaptiveAssessmentState
            if (parsed.answered_ids?.length > 0) {
              setAdaptiveState(parsed)
              setPrecisionMode(parsed.precision_mode)
              setCurrentQuestion(getNextQuestion(parsed))
              setStep('assessment')
              return
            }
          } catch { /* fall through */ }
        }

        // Clear any stale session
        localStorage.removeItem('mind_match_session')
        localStorage.removeItem('mind_match_session_ts')

        // Came from OAuth (?start=1) — enforce 6-month lock before starting fresh
        if (window.location.search.includes('start=1')) {
          window.history.replaceState({}, '', '/')

          // 6-month retake lock check
          const { data: lastAssessment } = await supabase
            .from('assessments')
            .select('completed_at')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(1)
            .single()

          if (lastAssessment?.completed_at) {
            const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000
            const completedAt = new Date(lastAssessment.completed_at).getTime()
            if (Date.now() - completedAt < SIX_MONTHS) {
              // Still within lock window — redirect to results
              window.location.href = '/?results=1'
              return
            }
          }

          setStep('onboarding')
          return
        }

        // Returning user with completed results (?results=1)
        if (window.location.search.includes('results=1')) {
          window.history.replaceState({}, '', '/')
          // Load results from Supabase
          const { data: assessment } = await supabase
            .from('assessments')
            .select('id, total_questions')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('completed_at', { ascending: false })
            .limit(1)
            .single()

          if (assessment) {
            const { data: sp } = await supabase
              .from('score_profiles')
              .select('*')
              .eq('assessment_id', assessment.id)
              .single()

            const { data: matches } = await supabase
              .from('career_matches')
              .select('career_id, overall_match, rank')
              .eq('user_id', user.id)
              .order('rank', { ascending: true })
              .limit(10)

            if (sp) {
              setScores(sp as ScoreProfile)
              const careerMatches = (matches || []).flatMap(m => {
                const c = careers.find(x => x.id === m.career_id)
                return c ? [{ ...c, match: m.overall_match, rank: m.rank }] : []
              })
              setMatchedCareers(careerMatches)
              // Reconstruct minimal adaptive state for display
              const fakeState = {
                ...initializeAdaptiveState(),
                answered_ids: Array(assessment.total_questions || 15).fill('loaded'),
              }
              setAdaptiveState(fakeState)
              setIsReturningUser(true)
              // Load O*NET scores from localStorage if available
              const savedOnet = localStorage.getItem('mind_match_onet_scores')
              if (savedOnet) {
                try { setOnetScores(JSON.parse(savedOnet)) } catch { /* ignore */ }
                setStep('results')
              } else {
                // Part 2 not done yet — send to bridge
                setStep('bridge')
              }
              return
            }
          }
          // Fallback: no results found, start fresh
          const initialState = { ...initializeAdaptiveState(), precision_mode: 'depth' as const }
          setAdaptiveState(initialState)
          setCurrentQuestion(getNextQuestion(initialState))
          setCurrentValue(3)
          setStep('assessment')
          return
        }

        // Direct visit while logged in — check for completed results
        const { data: existingAssessment } = await supabase
          .from('assessments')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .limit(1)
          .single()

        if (existingAssessment) {
          window.location.href = '/?results=1'
        } else {
          // No results, no in-progress session — collect profile first
          setStep('onboarding')
        }
      }
    }
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 1. Check for saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem('mind_match_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.answered_ids && parsed.answered_ids.length > 0) {
          setHasSavedSession(true)
        }
      } catch {
        localStorage.removeItem('mind_match_session')
      }
    }
  }, [])

  const handleResume = () => {
    const saved = localStorage.getItem('mind_match_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AdaptiveAssessmentState
        setAdaptiveState(parsed)
        setPrecisionMode(parsed.precision_mode)

        // Restore last question or get next
        const nextQ = getNextQuestion(parsed)
        setCurrentQuestion(nextQ)
        setStep('assessment')
      } catch {
        localStorage.removeItem('mind_match_session')
        setHasSavedSession(false)
      }
    }
  }

  // 2. Clear session on completion
  useEffect(() => {
    if (step === 'transition') {
      localStorage.removeItem('mind_match_session')
      localStorage.removeItem('mind_match_session_ts')
    }
  }, [step])

  // 2b. Transition screen — show bridge after 3.8s (gives archetype reveal time to breathe)
  useEffect(() => {
    if (step === 'transition') {
      const t = setTimeout(() => setStep('bridge'), 3800)
      return () => clearTimeout(t)
    }
  }, [step])

  // Scroll to top on every step change and on every new question
  useEffect(() => { window.scrollTo(0, 0) }, [step])
  useEffect(() => { window.scrollTo(0, 0) }, [currentQuestion])
  useEffect(() => { window.scrollTo(0, 0) }, [onetCurrentIndex])



  // 3. Auto-save on state change (set timestamp once when session starts)
  useEffect(() => {
    if (step === 'assessment' && adaptiveState.answered_ids.length > 0) {
      localStorage.setItem('mind_match_session', JSON.stringify(adaptiveState))
      if (!localStorage.getItem('mind_match_session_ts')) {
        localStorage.setItem('mind_match_session_ts', Date.now().toString())
      }
    }
  }, [adaptiveState, step])

  const completeAssessment = async (finalState: AdaptiveAssessmentState) => {
    const finalScores = calculateCurrentProfile(finalState)
    const finalCareers = calculateCareerMatches(finalScores, finalState.current_traits)

    setScores(finalScores)
    setMatchedCareers(finalCareers)
    setAdaptiveState(finalState)
    setPendingCompletionState(finalState)
    setSaveError(null)

    if (!authUser) {
      setPendingCompletionState(null)
      setStep('transition')
      return
    }

    setIsSavingResults(true)
    try {
      const assessmentId = await saveAssessmentResults(finalScores, finalCareers, finalState)
      if (!assessmentId) {
        throw new Error('save_failed')
      }
      setPendingCompletionState(null)
      setStep('transition')
    } catch (error) {
      console.error('Assessment save error:', error)
      setSaveError('We couldn’t save your results yet. Please retry before continuing.')
    } finally {
      setIsSavingResults(false)
    }
  }

  const handleRetrySave = async () => {
    if (!pendingCompletionState || isSavingResults) return
    await completeAssessment(pendingCompletionState)
  }


  const handleBeginAssessment = () => {
    localStorage.removeItem('mind_match_session')
    if (authUser) {
      supabase.from('profiles').update({
        first_name: userName.trim() || undefined,
        age: userAge ? parseInt(userAge) : undefined,
        gender: userGender || undefined,
        school_name: userSchool.trim() || undefined,
        goals: userGoals.trim() || undefined,
      }).eq('id', authUser.id).then(() => {/* silent */})
    }
    const initialState = { ...initializeAdaptiveState(), precision_mode: precisionMode }
    const firstQ = getNextQuestion(initialState)
    setAdaptiveState(initialState)
    setCurrentQuestion(firstQ)
    setCurrentValue(3)
    setStep('welcome')
  }

  const handleStartAssessment = () => {
    setStep('assessment')
  }

  const handleNext = async () => {
    if (!currentQuestion) return
    window.scrollTo({ top: 0, behavior: 'instant' })

    // 1. Apply current response to state
    const newState = applyResponseToState(adaptiveState, currentQuestion, currentValue)

    // 2. Check if we should stop
    const stopDecision = evaluateStopConditions(newState)
    setLastStopDecision(stopDecision)

    if (stopDecision.shouldStop) {
      // 3. Complete assessment
      await completeAssessment(newState)
    } else if (stopDecision.reason === 'clarifier_needed') {
      // PHASE 4: TRIGGER AI CLARIFIER
      setIsGeneratingClarifier(true)
      try {
        const topTraitsForTie = [...newState.current_traits].sort((a, b) => b.score - a.score).slice(0, 2)
        const tiedDimensions = topTraitsForTie.map(t => t.dimension)

        const res = await fetch('/api/clarifier', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tiedDimensions,
            context: newState.current_traits
          })
        })

        if (!res.ok) throw new Error('Clarifier failed')
        const clarifierQ = await res.json()

        setAdaptiveState(newState)
        setCurrentQuestion(clarifierQ)
        setCurrentValue(3)
      } catch (error) {
        console.error('Clarifier Error:', error)
        // Fallback to normal adaptive questions if AI generation fails
        const nextQ = getNextQuestion(newState)
        if (nextQ) {
          setAdaptiveState(newState)
          setCurrentQuestion(nextQ)
          setCurrentValue(3)
        } else {
          setStep('results')
        }
      } finally {
        setIsGeneratingClarifier(false)
      }
    } else {
      // 4. Get next adaptive question
      const nextQ = getNextQuestion(newState)

      // Edge case: selector returned null but stopDecision said continue
      if (!nextQ) {
        await completeAssessment(newState)
        return
      }

      setAdaptiveState(newState)
      setCurrentQuestion(nextQ)
      setCurrentValue(3) // Reset for next
    }
  }

  const calculateCareerMatches = (profile: ScoreProfile, traits: TraitUncertainty[], onet?: Record<string, number>) => {
    const confidenceMap: Record<string, number> = {}
    traits.forEach(t => { confidenceMap[t.dimension] = t.confidence })

    // O*NET dimension key map
    const onetKeyMap: Record<string, string> = {
      'riasec_realistic': 'R', 'riasec_investigative': 'I', 'riasec_artistic': 'A',
      'riasec_social': 'S', 'riasec_enterprising': 'E', 'riasec_conventional': 'C'
    }

    const dims = [
      { key: 'riasec_realistic', cKey: 'realistic' },
      { key: 'riasec_investigative', cKey: 'investigative' },
      { key: 'riasec_artistic', cKey: 'artistic' },
      { key: 'riasec_social', cKey: 'social' },
      { key: 'riasec_enterprising', cKey: 'enterprising' },
      { key: 'riasec_conventional', cKey: 'conventional' }
    ]

    return careers.map(career => {
      let weightedMatchSum = 0
      let totalWeight = 0

      dims.forEach(d => {
        let score = profile[d.key as keyof ScoreProfile] as number

        // Blend with O*NET if available (60% RIASEC adaptive, 40% O*NET)
        if (onet) {
          const onetDim = onetKeyMap[d.key]
          if (onet[onetDim] !== undefined) {
            score = 0.6 * score + 0.4 * onet[onetDim]
          }
        }

        const careerScore = career.riasec_profile[d.cKey as keyof typeof career.riasec_profile]
        const confidence = confidenceMap[d.key] || 0.5

        // Non-linear similarity: large gaps penalised much harder than small ones
        const diff = Math.abs(score - careerScore)
        const similarity = Math.max(0, 100 - Math.pow(diff, 1.7) / 50)

        // Weight by confidence × career requirement strength
        // High-requirement dimensions (careerScore > 70) drive the match more
        const requirementWeight = Math.max(0.3, careerScore / 100)
        weightedMatchSum += similarity * confidence * requirementWeight
        totalWeight += confidence * requirementWeight
      })

      const finalMatch = totalWeight > 0 ? (weightedMatchSum / totalWeight) : 0
      return { ...career, match: Math.round(finalMatch), rank: 0 }
    })
      .sort((a, b) => b.match - a.match)
      .slice(0, 10)
      .map((c, i) => ({ ...c, rank: i + 1 }))
  }

  const handleStartOnet = () => {
    setOnetCurrentIndex(0)
    setOnetResponses({})
    setOnetCurrentValue(3)
    setStep('onet_assessment')
  }

  const handleOnetNext = () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const q = onetQuestions[onetCurrentIndex]
    const updated = { ...onetResponses, [q.id]: onetCurrentValue }
    setOnetResponses(updated)

    const nextIndex = onetCurrentIndex + 1

    if (nextIndex >= onetQuestions.length) {
      // All 60 done — re-run career matching with O*NET blended in
      const onet = scoreOnetResponses(updated)
      setOnetScores(onet)
      localStorage.setItem('mind_match_onet_scores', JSON.stringify(onet))
      if (scores) {
        const blended = calculateCareerMatches(scores, adaptiveState.current_traits, onet)
        setMatchedCareers(blended)
      }
      setStep('results')
    } else if (nextIndex % 10 === 0) {
      // Completed a round of 10 — show dimension reveal
      setRevealDimension(q.dimension)
      setShowDimensionReveal(true)
      setOnetCurrentIndex(nextIndex)
      setOnetCurrentValue(3)
    } else {
      setOnetCurrentIndex(nextIndex)
      setOnetCurrentValue(3)
    }
  }

  // Purely heuristic progress based on confidence of top 3 dimensions
  const topTraits = [...adaptiveState.current_traits].sort((a, b) => b.score - a.score).slice(0, 3)
  const avgConfidence = topTraits.length > 0
    ? topTraits.reduce((acc, t) => acc + t.confidence, 0) / 3
    : 0
  const progress = Math.max((adaptiveState.answered_ids.length / 50) * 100, avgConfidence * 100)

  if (step === 'onboarding') {
    return (
      <div className="bg-[#0B0C10] min-h-screen text-white flex flex-col px-4">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[#0B0C10] border-b border-white/5 flex items-center justify-between px-4 py-4 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight">CareerLens</span>
          </div>
          {authUser && <UserAvatar authUser={authUser} showMenu={showUserMenu} setShowMenu={setShowUserMenu} onLogout={handleLogout} />}
        </header>

        <div className="flex-1 py-10">
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-4xl font-black tracking-tighter mb-2">Before we begin.</h2>
          <p className="text-slate-400 mb-10">Just one quick thing so we can personalise your experience.</p>

          {/* Name */}
          <div className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Your First Name</label>
            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="e.g. Hamza"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Stage */}
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Where are you right now?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserStage('school')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${userStage === 'school' ? 'border-blue-600 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <GraduationCap className={`w-6 h-6 mb-3 ${userStage === 'school' ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="font-black text-sm uppercase tracking-wide">In School</div>
                <div className="text-xs text-slate-500 mt-1">O/A Levels or equivalent</div>
              </button>
              <button
                onClick={() => setUserStage('university')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${userStage === 'university' ? 'border-blue-600 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <Briefcase className={`w-6 h-6 mb-3 ${userStage === 'university' ? 'text-blue-400' : 'text-slate-500'}`} />
                <div className="font-black text-sm uppercase tracking-wide">University</div>
                <div className="text-xs text-slate-500 mt-1">Undergraduate or postgrad</div>
              </button>
            </div>
          </div>

          {/* Age + Gender row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Age</label>
              <input
                type="number"
                min={10}
                max={30}
                value={userAge}
                onChange={e => setUserAge(e.target.value)}
                placeholder="e.g. 17"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-base font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 focus:bg-white/8 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Gender</label>
              <div className="flex flex-col gap-2">
                {(['Male', 'Female', 'Prefer not to say'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setUserGender(g)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all text-left ${userGender === g ? 'border-blue-600 bg-blue-600/10 text-blue-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* School Name */}
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">School / University Name</label>
            <input
              type="text"
              value={userSchool}
              onChange={e => setUserSchool(e.target.value)}
              placeholder="e.g. Lahore Grammar School"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Goals */}
          <div className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">What do you hope to figure out? <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
            <textarea
              value={userGoals}
              onChange={e => setUserGoals(e.target.value)}
              placeholder="e.g. I'm unsure whether to go into medicine or engineering. My parents want me to be a doctor but I love building things..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 focus:bg-white/8 transition-all resize-none"
            />
          </div>

          <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            After your results, an AI Career Coach will be available to answer any questions about your matches and next steps.
          </p>

          <Button
            onClick={handleBeginAssessment}
            disabled={!userName.trim()}
            className="w-full h-14 text-base font-black bg-blue-600 hover:bg-white hover:text-black rounded-full shadow-2xl shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Continue
            <ChevronRight className="ml-2 w-5 h-5" />
          </Button>

          {hasSavedSession && (
            <button onClick={handleResume} className="w-full mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Resume Active Session
            </button>
          )}
        </div>
        </div>
      </div>
    )
  }

  if (step === 'welcome') {
    return (
      <div className="bg-[#0B0C10] min-h-screen text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-12">
            {[{ label: 'Setup', done: true }, { label: 'Assessment', done: false, active: true }, { label: 'Your Results', done: false }].map(({ label, done, active }, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <div className={`h-px w-8 ${done || active ? 'bg-blue-500/60' : 'bg-white/10'}`} />}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border
                    ${done ? 'bg-blue-600 border-blue-600 text-white' : active ? 'border-blue-500 text-blue-400' : 'border-white/15 text-slate-600'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${active ? 'text-white' : done ? 'text-blue-400' : 'text-slate-600'}`}>{label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-black tracking-tighter mb-3">
            {userName ? `You're all set, ${userName}.` : "You're all set."}
          </h2>
          <p className="text-slate-400 mb-10">Here&apos;s what happens next.</p>

          {/* What to expect */}
          <div className="space-y-4 mb-10">
            {[
              {
                num: '01',
                title: '20–30 adaptive questions',
                desc: 'The assessment adjusts based on your answers — so every question is tailored to you specifically.',
                color: 'text-blue-400',
                border: 'border-blue-500/20',
                bg: 'bg-blue-500/5',
              },
              {
                num: '02',
                title: 'No right or wrong answers',
                desc: 'This is not a test you can pass or fail. Answer honestly — the more genuine you are, the more accurate your results.',
                color: 'text-violet-400',
                border: 'border-violet-500/20',
                bg: 'bg-violet-500/5',
              },
              {
                num: '03',
                title: 'Your results are waiting at the end',
                desc: 'Career matches, subject recommendations, and a full personality breakdown — all generated from your unique profile.',
                color: 'text-emerald-400',
                border: 'border-emerald-500/20',
                bg: 'bg-emerald-500/5',
              },
            ].map(({ num, title, desc, color, border, bg }) => (
              <div key={num} className={`${bg} border ${border} rounded-2xl p-5 flex gap-4`}>
                <span className={`text-2xl font-black ${color} shrink-0 leading-none mt-0.5`}>{num}</span>
                <div>
                  <p className="text-sm font-black text-white mb-1">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Psychologist's note */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">A note from our psychologist</p>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              &ldquo;Most students already have a sense of who they are — they just haven&apos;t had a framework to articulate it. This assessment gives you that language. Trust your first instinct on every question.&rdquo;
            </p>
          </div>

          <button
            onClick={handleStartAssessment}
            className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-500 rounded-full shadow-2xl shadow-blue-600/20 transition-all text-white"
          >
            Start Assessment →
          </button>
        </div>
      </div>
    )
  }

  if (step === 'landing') {
    // If user is already logged in OR returning from OAuth — show loading spinner, never show the landing page
    const hasAuthParam = typeof window !== 'undefined' && (window.location.search.includes('start=1') || window.location.search.includes('results=1'))
    if (authUser || hasAuthParam) {
      return (
        <div className="bg-[#0a0a0f] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <p className="text-white font-black text-lg">CareerLens</p>
            <p className="text-slate-400 text-sm mt-1">Setting up your assessment…</p>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-[#0a0a0f] min-h-screen text-white flex flex-col relative overflow-hidden">

        {/* ── Ambient orbs ─────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-orb absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="animate-orb-slow absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px]" />
          <div className="animate-orb absolute bottom-10 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[90px]" />
        </div>

        {/* ── Nav ──────────────────────────────────────────────────────── */}
        <header className="relative z-40 flex items-center justify-between px-6 sm:px-10 py-5 w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-lg">Career<span className="text-blue-400">Lens</span></span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="hidden sm:flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />O*NET Certified</span>
            <span className="hidden sm:block w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" />~20–30 min</span>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-8 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — copy */}
          <div>
            <div className="animate-slide-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              Made for students in Pakistan
            </div>

            <h1 className="animate-slide-up-1 text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] mb-4">
              Not sure what subjects<br />or degree to choose?
            </h1>

            <p className="animate-slide-up-2 text-2xl sm:text-3xl font-black text-blue-400 mb-6 tracking-tight">
              Find your best-fit path<br />in 20 minutes.
            </p>

            <ul className="animate-slide-up-2 space-y-2.5 mb-8">
              {[
                'The subjects you should choose',
                'The degrees that fit you',
                'Careers you\'re most likely to succeed in',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-blue-400" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="animate-slide-up-3 flex flex-col items-start gap-3">
              <a
                href="/auth/register"
                className="h-16 px-10 flex items-center justify-center gap-3 text-base font-black bg-blue-600 text-white hover:bg-blue-500 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.35)] hover:shadow-[0_0_70px_rgba(99,102,241,0.55)] active:scale-[0.98] transition-all duration-300"
              >
                Get Started
              </a>
              {ENABLE_GOOGLE && (
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 flex-none" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              )}
              <p className="text-xs text-slate-500 ml-1">
                Already registered?{' '}
                <a href="/auth" className="text-blue-400 hover:underline font-semibold">Sign in</a>
              </p>
              {hasSavedSession && (
                <button onClick={handleResume} className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-2 ml-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Resume active session
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — product preview card */}
          <div className="animate-slide-up-2 hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Mock result card */}
              <div className="bg-gradient-to-br from-[#0f1629] to-[#1a1040] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-indigo-900/40">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Your result</p>
                    <p className="text-sm font-black text-white">CareerLens Report</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Personality Type</p>
                <p className="text-3xl font-black text-white mb-1">The <span className="text-blue-400">Innovator</span></p>
                <div className="flex gap-2 mb-5">
                  {[['I','Analytical','text-blue-400','border-blue-500/30'],['E','Leadership','text-red-400','border-red-500/30'],['A','Creative','text-purple-400','border-purple-500/30']].map(([code,label,col,border]) => (
                    <div key={code} className={`border ${border} rounded-lg px-2.5 py-1.5`} style={{background:'rgba(255,255,255,0.04)'}}>
                      <span className={`text-sm font-black ${col}`}>{code}</span>
                      <span className="text-slate-500 text-[10px] ml-1">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Top Career Matches</p>
                {[['Software Engineer','98%'],['Data Scientist','95%'],['Product Manager','91%']].map(([career, pct]) => (
                  <div key={career} className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-300 font-semibold">{career}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{width: pct}} />
                      </div>
                      <span className="text-xs font-black text-blue-400">{pct}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-white/6">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">A Level Roadmap</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mathematics','Physics','Computer Science'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-md">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                Your results await
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2 — STATS STRIP
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-14">
          <div className="border-t border-b border-white/6 py-5 grid grid-cols-3 gap-4 text-center">
            {[
              ['Built for', 'students in Pakistan'],
              ['Based on', 'global career frameworks'],
              ['Designed for', 'real academic decisions'],
            ].map(([top, bottom]) => (
              <div key={top}>
                <p className="text-sm sm:text-base font-black text-white leading-tight">{top}</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{bottom}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 3 — WHAT YOU GET
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold text-center mb-6">What you get</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Brain className="w-5 h-5 text-blue-400" />, title: 'Understand yourself', desc: 'Discover how you think, work, and what drives you' },
              { icon: <Briefcase className="w-5 h-5 text-indigo-400" />, title: 'See your best-fit careers', desc: 'Get matched to careers where you\'ll actually thrive' },
              { icon: <GraduationCap className="w-5 h-5 text-violet-400" />, title: 'Get your subject roadmap', desc: 'Know exactly what to study next' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/4 border border-white/8 rounded-2xl p-5 card-shimmer-border">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">{icon}</div>
                <p className="text-sm font-black text-white mb-1">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 4 — WHERE COULD YOU GO?
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <p className="text-2xl sm:text-3xl font-black text-white text-center mb-2">Where could you go?</p>
          <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold text-center mb-8">A preview of what&apos;s possible</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { emoji: '💻', label: 'Software Engineer' },
              { emoji: '🩺', label: 'Doctor' },
              { emoji: '🎨', label: 'Designer' },
              { emoji: '💼', label: 'Entrepreneur' },
              { emoji: '📊', label: 'Data Scientist' },
              { emoji: '🏛️', label: 'Business Leader' },
            ].map(({ emoji, label }) => (
              <div key={label} className="bg-white/3 border border-white/6 rounded-xl px-4 py-4 flex items-center gap-3 hover:bg-white/6 hover:border-white/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:scale-[1.02] transition-all duration-200 cursor-default">
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-bold text-slate-200">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 5 — BEFORE vs AFTER
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <p className="text-2xl sm:text-3xl font-black text-white text-center mb-8">Before vs after CareerLens</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="bg-red-500/5 border border-red-500/15 rounded-2xl p-6">
              <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-4">Before CareerLens</p>
              <ul className="space-y-3">
                {[
                  'Not sure which subjects to choose',
                  'Choosing based on pressure or guesswork',
                  'No clear direction for your future',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <span className="text-red-500 mt-0.5 shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* After */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4">After CareerLens</p>
              <ul className="space-y-3">
                {[
                  'Clear subject choices based on your profile',
                  'Confident direction that fits who you are',
                  'Can explain your path to anyone',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 6 — TESTIMONIALS
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <p className="text-[11px] text-slate-600 uppercase tracking-widest font-bold text-center mb-2">What students say</p>
          <p className="text-2xl sm:text-3xl font-black text-white text-center mb-8">From students across Pakistan.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              {
                quote: 'I thought I wanted pre-med just because everyone else did. CareerLens showed me I\'m built for engineering. Best 20 minutes I\'ve spent.',
                name: 'Omar', school: 'A-Levels, Faisalabad',
                img: '/avatar-omar.jpg', ring: 'ring-blue-400/30',
              },
              {
                quote: 'My dad kept saying law, I kept saying no. The results gave us something to actually talk about. We both agreed on business after seeing my profile.',
                name: 'Bilal', school: 'O-Levels, Karachi',
                img: '/avatar-bilal.jpg', ring: 'ring-indigo-400/30',
              },
              {
                quote: 'I knew I liked physics but didn\'t know what to do with it. CareerLens pointed me to data science — never even considered it before.',
                name: 'Danish', school: 'A-Levels, Daska',
                img: '/avatar-danish.jpg', ring: 'ring-violet-400/30',
              },
              {
                quote: 'I\'ve been the creative one in a family of doctors. Seeing it confirmed in the results gave me the confidence to actually say it out loud.',
                name: 'Maryam', school: 'FSc, Lahore',
                img: '/avatar-maryam.jpg', ring: 'ring-pink-400/30',
              },
            ].map(({ quote, name, school, img, ring }) => (
              <div key={name} className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:border-white/12 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ${ring}`}>
                    <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{school}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                quote: 'I just wanted to know if I should pick Commerce or Science. I got a full breakdown of how I actually think. Way more than I expected.',
                name: 'Ibrahim', school: 'O-Levels, Sargodha',
                img: '/avatar-ibrahim.jpg', ring: 'ring-teal-400/30',
              },
              {
                quote: 'Didn\'t believe an online test could be this specific. My top match was architecture and I\'ve been secretly drawing buildings since I was 10.',
                name: 'Sana', school: 'A-Levels, Peshawar',
                img: '/avatar-sana.jpg', ring: 'ring-emerald-400/30',
              },
              {
                quote: 'Took it to confirm I chose the right degree. Turns out I did — but it also showed me specializations I hadn\'t even thought about.',
                name: 'Nadia', school: 'BS Psychology, Rawalpindi',
                img: '/avatar-nadia.jpg', ring: 'ring-amber-400/30',
              },
            ].map(({ quote, name, school, img, ring }) => (
              <div key={name} className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:border-white/12 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ${ring}`}>
                    <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{school}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 7 — FINAL CTA
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pb-16">
          <div className="relative bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-violet-600/8 border border-blue-500/20 rounded-2xl p-10 text-center overflow-hidden">
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-blue-500/15 blur-[60px]" />
            <h2 className="relative text-3xl sm:text-4xl font-black tracking-tight mb-2">Don&apos;t guess your future.</h2>
            <p className="relative text-slate-400 text-base mb-7">Find your best-fit path today.</p>
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-black bg-blue-600 text-white hover:bg-blue-500 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.45)] transition-all duration-300"
            >
              Get Started
            </a>
            <p className="text-xs text-slate-600 mt-3">
              Already registered?{' '}
              <a href="/auth" className="text-blue-400 hover:underline">Sign in</a>
            </p>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/5 px-6 py-5 flex flex-wrap justify-center gap-5 text-[11px] text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />Your data is private</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-blue-400" />Powered by O*NET · U.S. Dept. of Labor</span>
          <span className="flex items-center gap-1.5"><Microscope className="w-3.5 h-3.5 text-violet-400" />Built for students in Pakistan</span>
        </footer>
      </div>
    )
  }

  if (step === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Assessment Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800">CareerLens</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Question {adaptiveState.answered_ids.length + 1}</span>
                {authUser && (
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-2 text-xs text-slate-500">
              {currentQuestion?.section || 'Assessment'}
            </div>
          </div>
        </header>

        {/* Question */}
        <main className="max-w-2xl mx-auto px-4 pt-12 pb-28">
          {saveError && (
            <Card className="border border-rose-200 bg-rose-50 shadow-sm mb-6">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-rose-700">Result save failed</p>
                    <p className="text-sm text-rose-600 mt-1">{saveError}</p>
                  </div>
                  <Button onClick={handleRetrySave} disabled={isSavingResults} className="bg-rose-600 hover:bg-rose-700">
                    {isSavingResults ? 'Retrying...' : 'Retry Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isGeneratingClarifier ? (
            <Card className="border-0 shadow-lg bg-white overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 animate-infinite-scroll" />
              <CardContent className="pt-16 pb-16 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center relative rotate-12 animate-pulse">
                    <Brain className="w-12 h-12 text-blue-600 -rotate-12" />
                  </div>
                  <Sparkles className="w-8 h-8 text-indigo-400 absolute -top-4 -right-4 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Deepening Your Profile</h2>
                <div className="flex gap-1 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200" />
                </div>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                  Our AI identified a resolution boundary between your top traits.
                  Generating a custom behavioral question for institutional-grade precision...
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                  {currentQuestion?.category === 'clarifier' && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Clarifier
                    </span>
                  )}
                  How much do you agree with this statement?
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-8 leading-tight">
                  {currentQuestion?.text}
                </h2>

                {/* Likert Scale */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-2 px-1">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => setCurrentValue(value)}
                        className={`w-14 h-14 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center font-bold text-lg ${currentValue === value
                          ? 'border-blue-600 bg-blue-50 text-blue-600 scale-110 shadow-md shadow-blue-100'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400'
                          }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* Adaptive Progress Language */}
          <div className="mt-8 text-center space-y-2">
            <div className="text-sm font-medium text-slate-700 flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Engine Status: {adaptiveState.answered_ids.length < 15 ? 'Gathering Core Data' : 'Tuning Profiles'}
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our engine is analyzing your responses in real-time. {avgConfidence > 0.7 ? "We&apos;re close to a high-confidence match!" : "Still gathering data to ensure accuracy."}
            </p>
          </div>

          {/* Debug Mode Toggle */}
          <div className="mt-12 pt-8 border-t flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(!showDebug)} className="text-slate-400 text-xs">
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </Button>
          </div>

          {showDebug && (
            <div className="mt-4 p-4 bg-slate-800 text-white rounded-lg text-xs font-mono space-y-2 max-w-2xl mx-auto overflow-auto">
              <div>Questions Answered: {adaptiveState.answered_ids.length}</div>
              <div>Stability Count: {adaptiveState.stability_count}</div>
              <div>Top Confidence: {(avgConfidence * 100).toFixed(1)}%</div>
              <div>Last Decision: {lastStopDecision?.reason || 'none'}</div>
              <div className="border-t border-slate-700 pt-2">
                {topTraits.map((t: TraitUncertainty) => (
                  <div key={t.dimension}>{t.dimension}: Score {t.score} | Conf {(t.confidence * 100).toFixed(1)}%</div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ── Fixed bottom action bar (adaptive test) ─────────────────── */}
        {!isGeneratingClarifier && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="max-w-2xl mx-auto flex justify-end">
              <Button onClick={handleNext} disabled={isSavingResults} className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 group disabled:opacity-60">
                {isSavingResults ? 'Saving Results...' : adaptiveState.answered_ids.length >= 14 ? 'Process & Continue' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}
        {/* ────────────────────────────────────────────────────────────── */}
      </div>
    )
  }

  if (step === 'onet_assessment') {
    const q = onetQuestions[onetCurrentIndex]
    const roundIndex = Math.floor(onetCurrentIndex / 10) // 0-5
    const questionInRound = onetCurrentIndex % 10        // 0-9
    const completedRounds = Math.floor(onetCurrentIndex / 10)

    const DIM_META: Record<string, { name: string; color: string; bg: string; text: string; border: string; tagline: string; insight: string }> = {
      R: { name: 'Practical Skills',   color: 'bg-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', tagline: 'Hands-on & technical',   insight: 'You lean towards building, fixing, and working with your hands.' },
      I: { name: 'Analytical Mind',    color: 'bg-blue-500',    bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',    tagline: 'Curious & investigative', insight: 'You love figuring out how things work and solving complex problems.' },
      A: { name: 'Creative Side',      color: 'bg-purple-500',  bg: 'bg-purple-50',   text: 'text-purple-700',  border: 'border-purple-200',  tagline: 'Expressive & imaginative', insight: 'Your profile shows a strong creative and artistic streak.' },
      S: { name: 'People Skills',      color: 'bg-yellow-400',  bg: 'bg-yellow-50',   text: 'text-yellow-700',  border: 'border-yellow-200',  tagline: 'Caring & collaborative',  insight: 'You connect well with people and enjoy helping others grow.' },
      E: { name: 'Leadership Drive',   color: 'bg-red-500',     bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200',     tagline: 'Bold & entrepreneurial',  insight: 'You have the instincts of a leader — persuading and driving results.' },
      C: { name: 'Organised Thinking', color: 'bg-slate-400',   bg: 'bg-slate-50',    text: 'text-slate-700',   border: 'border-slate-200',   tagline: 'Structured & reliable',   insight: 'You bring order and precision — a rare and valuable trait.' },
    }

    const ROUNDS = [
      { code: 'R', label: 'Practical' },
      { code: 'I', label: 'Analytical' },
      { code: 'A', label: 'Creative' },
      { code: 'S', label: 'People' },
      { code: 'E', label: 'Leadership' },
      { code: 'C', label: 'Organised' },
    ]

    const getButtonCopy = () => {
      const remaining = onetQuestions.length - 1 - onetCurrentIndex
      if (onetCurrentIndex === onetQuestions.length - 1) return 'See My Career Matches'
      if (remaining <= 5) return 'Almost there!'
      if (remaining <= 15) return 'Final stretch →'
      if ((onetCurrentIndex + 1) % 10 === 0) return 'Complete this round →'
      return 'Next Activity'
    }

    const getMilestoneMessage = () => {
      const done = onetCurrentIndex + 1
      if (done === 45) return "You're 75% done — career matches are forming."
      if (done === 50) return "Final 10 questions. Your profile is almost complete."
      if (done === 55) return "5 left. Your results are waiting for you."
      return null
    }


    const milestoneMsg = getMilestoneMessage()

    // Dimension reveal overlay
    if (showDimensionReveal) {
      const meta = DIM_META[revealDimension]
      const nextRound = ROUNDS[roundIndex]
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <header className="sticky top-0 z-40 bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">CareerLens</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Round {roundIndex} of 6 Complete</div>
          </header>
          {/* 6-segment progress */}
          <div className="w-full flex h-1.5">
            {ROUNDS.map((r, i) => (
              <div key={r.code} className={`flex-1 ${i < roundIndex ? DIM_META[r.code].color : 'bg-slate-100'} ${i > 0 ? 'ml-0.5' : ''} transition-all duration-500`} />
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm text-center">
              {/* Completed badge */}
              <div className={`inline-flex items-center gap-2 ${meta.bg} ${meta.border} border rounded-full px-4 py-1.5 mb-6`}>
                <span className={`w-2 h-2 rounded-full ${meta.color}`} />
                <span className={`text-xs font-bold ${meta.text}`}>{meta.name} — Complete ✓</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                {meta.insight}
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                {roundIndex < 6 ? `Up next: ${nextRound?.label} profile — ${6 - roundIndex} rounds to go.` : 'Last round coming up!'}
              </p>
              {/* Mini round tracker */}
              <div className="flex justify-center gap-2 mb-8">
                {ROUNDS.map((r, i) => (
                  <div key={r.code} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${i < roundIndex ? `${DIM_META[r.code].color} text-white` : 'bg-slate-100 text-slate-400'}`}>
                    {i < roundIndex ? '✓' : r.code}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowDimensionReveal(false)}
                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-slate-900">CareerLens</span>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Round {roundIndex + 1} of 6</p>
            <p className="text-xs text-slate-500">{questionInRound + 1} of 10 in this round</p>
          </div>
        </header>

        {/* 6-segment progress bar */}
        <div className="w-full flex h-1.5">
          {ROUNDS.map((r, i) => {
            const isComplete = i < completedRounds
            const isCurrent = i === completedRounds
            const segmentFill = isCurrent ? ((questionInRound + 1) / 10) * 100 : isComplete ? 100 : 0
            return (
              <div key={r.code} className={`flex-1 bg-slate-100 overflow-hidden ${i > 0 ? 'ml-0.5' : ''}`}>
                <div
                  className={`h-full ${DIM_META[r.code].color} transition-all duration-300`}
                  style={{ width: `${segmentFill}%` }}
                />
              </div>
            )
          })}
        </div>

        <main className="flex-1 flex flex-col justify-center px-6 pt-10 pb-28 max-w-2xl mx-auto w-full">

          {/* Dimension label */}
          <div className="mb-8 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${DIM_META[q.dimension].color}`} />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {DIM_META[q.dimension].name} · {DIM_META[q.dimension].tagline}
            </span>
          </div>

          {/* Milestone message */}
          {milestoneMsg && (
            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-700 font-semibold">{milestoneMsg}</p>
            </div>
          )}

          <div className="mb-10">
            <p className="text-xs text-slate-400 mb-3">How would you feel about this activity?</p>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">{q.text}</h2>
          </div>


          <div className="space-y-3 mb-10">
            {([
              { value: 1, label: 'Strongly Dislike', activeColor: 'border-red-500 bg-red-50 text-red-600',       hoverColor: 'hover:border-red-300' },
              { value: 2, label: 'Dislike',          activeColor: 'border-orange-500 bg-orange-50 text-orange-600', hoverColor: 'hover:border-orange-300' },
              { value: 3, label: 'Unsure',           activeColor: 'border-slate-500 bg-slate-50 text-slate-600',  hoverColor: 'hover:border-slate-400' },
              { value: 4, label: 'Like',             activeColor: 'border-blue-500 bg-blue-50 text-blue-600',     hoverColor: 'hover:border-blue-300' },
              { value: 5, label: 'Strongly Like',    activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-600', hoverColor: 'hover:border-emerald-300' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                onClick={() => setOnetCurrentValue(opt.value)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left font-semibold text-sm ${
                  onetCurrentValue === opt.value
                    ? opt.activeColor
                    : `bg-white text-slate-600 border-slate-200 ${opt.hoverColor}`
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  onetCurrentValue === opt.value ? 'border-current' : 'border-slate-300'
                }`}>
                  {onetCurrentValue === opt.value && <span className="w-2 h-2 rounded-full bg-current" />}
                </span>
                {opt.label}
              </button>
            ))}
          </div>

        </main>

        {/* ── Fixed bottom action bar ─────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleOnetNext}
              className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {getButtonCopy()}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* ────────────────────────────────────────────────────────────── */}
      </div>
    )
  }

  if (step === 'transition') {
    const transitionArchetype = scores ? getArchetype(scores) : null
    const transitionTopRIASEC = scores ? getTopRIASECCodes(scores) : []
    const RIASEC_REVEAL: Record<string, { label: string; color: string; ring: string; glow: string }> = {
      R: { label: 'Hands-On',       color: 'text-emerald-400', ring: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' },
      I: { label: 'Analytical',     color: 'text-blue-400',    ring: 'border-blue-500/40',    glow: 'shadow-blue-500/20'    },
      A: { label: 'Creative',       color: 'text-purple-400',  ring: 'border-purple-500/40',  glow: 'shadow-purple-500/20'  },
      S: { label: 'People-Oriented',color: 'text-yellow-400',  ring: 'border-yellow-500/40',  glow: 'shadow-yellow-500/20'  },
      E: { label: 'Leadership',     color: 'text-red-400',     ring: 'border-red-500/40',     glow: 'shadow-red-500/20'     },
      C: { label: 'Organised',      color: 'text-slate-400',   ring: 'border-slate-500/40',   glow: 'shadow-slate-500/20'   },
    }
    const top3 = transitionTopRIASEC.slice(0, 3)
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col text-white relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[100px]" />
        </div>

        <header className="relative z-10 flex items-center px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-black tracking-tight">Career<span className="text-blue-400">Lens</span></span>
          </div>
        </header>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

          {/* Part 1 complete badge */}
          <div className="animate-slide-up inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <ShieldCheck className="w-3.5 h-3.5" />
            Personality Profile Complete
          </div>

          {/* Main reveal */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-[0.2em] mb-3 animate-slide-up-1">
              You are
            </p>
            {transitionArchetype ? (
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-2">
                {/* Each word animates in separately */}
                {'The '.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="inline-block animate-letter-reveal text-white"
                    style={{ animationDelay: `${0.05 + i * 0.04}s`, opacity: 0 }}
                  >{ch === ' ' ? '\u00A0' : ch}</span>
                ))}
                {transitionArchetype.split('').map((ch, i) => (
                  <span
                    key={i + 10}
                    className="inline-block animate-letter-reveal bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent"
                    style={{ animationDelay: `${0.25 + i * 0.055}s`, opacity: 0 }}
                  >{ch === ' ' ? '\u00A0' : ch}</span>
                ))}
              </h1>
            ) : (
              <h1 className="text-6xl font-black tracking-tighter text-white">Profile Ready</h1>
            )}
          </div>

          {/* Holland Code pills */}
          {top3.length > 0 && (
            <div className="flex justify-center gap-3 mb-8">
              {top3.map((code, idx) => {
                const meta = RIASEC_REVEAL[code]
                return (
                  <div
                    key={code}
                    className={`animate-slide-up border ${meta.ring} rounded-xl px-5 py-3 shadow-lg ${meta.glow}`}
                    style={{ opacity: 0, animationDelay: `${0.8 + idx * 0.12}s` }}
                  >
                    <div className={`text-2xl font-black ${meta.color}`}>{code}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{meta.label}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Loading dots */}
          <div className="flex gap-1.5 justify-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-slate-600 text-xs font-semibold mt-3 uppercase tracking-widest">Preparing Part 2…</p>
        </div>
      </div>
    )
  }

  if (step === 'bridge' && scores) {
    const topRIASEC = getTopRIASECCodes(scores)
    const archetype = getArchetype(scores)
    const RIASEC_META: Record<string, { label: string; color: string; bg: string; desc: string }> = {
      R: { label: 'Hands-On',        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Practical & technical' },
      I: { label: 'Analytical',      color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',       desc: 'Curious & investigative' },
      A: { label: 'Creative',        color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20',   desc: 'Expressive & imaginative' },
      S: { label: 'People-Oriented', color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20',   desc: 'Empathetic & social' },
      E: { label: 'Leadership',      color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         desc: 'Driven & persuasive' },
      C: { label: 'Organised',       color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',     desc: 'Structured & detail-oriented' },
    }
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col text-white relative overflow-hidden">
        {/* Ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <header className="relative z-10 flex items-center px-6 py-5 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-black tracking-tight">Career<span className="text-blue-400">Lens</span></span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Part 1 Done
            </div>
            <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
              Part 2 of 2
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">

            {/* Archetype identity block */}
            <div className="text-center mb-8 animate-slide-up">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your Personality Type</p>
              <h1 className="text-5xl font-black tracking-tighter mb-1">
                The <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{archetype}</span>
              </h1>
              <div className="flex justify-center gap-2 mt-5">
                {topRIASEC.slice(0, 3).map(code => (
                  <div key={code} className={`border rounded-xl px-4 py-2.5 ${RIASEC_META[code]?.bg} backdrop-blur-sm`}>
                    <div className={`text-xl font-black ${RIASEC_META[code]?.color}`}>{code}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{RIASEC_META[code]?.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bridge card */}
            <div className="animate-slide-up-1 relative bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-violet-600/8 border border-blue-500/20 rounded-2xl p-6 mb-4 overflow-hidden">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="flex items-center gap-3 mb-4 relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Part 2 — Career Profiler</div>
                  <div className="text-base font-black text-white leading-tight">Match your profile to real careers</div>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-5 relative">
                60 questions mapped to 800+ career paths — from engineering and medicine to business, creative arts, and tech. This is where your results get specific.
              </p>

              <div className="flex items-center gap-5 mb-5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-400" />60 questions</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-400" />~15 minutes</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-400" />O*NET powered</span>
              </div>

              <button
                onClick={() => { setOnetCurrentIndex(0); setOnetResponses({}); setOnetCurrentValue(3); setStep('onet_assessment') }}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-blue-500/25 relative"
              >
                Start Career Matching <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Reassurance */}
            <div className="animate-slide-up-2 flex items-start gap-3 bg-white/2 border border-white/5 rounded-xl p-4">
              <Microscope className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Your personality profile is saved. Part 2 uses the U.S. Department of Labor&apos;s O*NET framework — the global gold standard for career matching used by universities worldwide.
              </p>
            </div>

          </div>
        </div>
      </div>
    )
  }

  if (step === 'results' && scores) {
    const topRIASEC = getTopRIASECCodes(scores)
    const topStrengths = getTopStrengths(scores).slice(0, 3)
    const topMotivations = getTopMotivations(scores).slice(0, 3)
    const archetype = getArchetype(scores)
    const proximityData = getArchetypeProximity(scores)

    const radarData = [
      { subject: 'Hands-On', score: scores.riasec_realistic, fullMark: 100 },
      { subject: 'Analytical', score: scores.riasec_investigative, fullMark: 100 },
      { subject: 'Creative', score: scores.riasec_artistic, fullMark: 100 },
      { subject: 'People-Oriented', score: scores.riasec_social, fullMark: 100 },
      { subject: 'Leadership', score: scores.riasec_enterprising, fullMark: 100 },
      { subject: 'Organised', score: scores.riasec_conventional, fullMark: 100 },
    ]

    return (
      <ResultsDashboard
        scores={scores}
        matchedCareers={matchedCareers}
        topStrengths={topStrengths}
        topMotivations={topMotivations}
        topRIASEC={topRIASEC}
        archetype={archetype}
        userName={userName}
        userStage={userStage}
        adaptiveState={adaptiveState}
        authUser={authUser}
        isReturningUser={isReturningUser}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        onLogout={handleLogout}
        userAge={userAge}
        userGender={userGender}
        userSchool={userSchool}
        userGoals={userGoals}
        isCoachOpen={isCoachOpen}
        setIsCoachOpen={setIsCoachOpen}
        showClinicalAudit={showClinicalAudit}
        setShowClinicalAudit={setShowClinicalAudit}
        radarData={radarData}
        proximityData={proximityData}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
        onetScores={onetScores}
        onStartOnet={handleStartOnet}
      />
    )
  }

  return null
}
