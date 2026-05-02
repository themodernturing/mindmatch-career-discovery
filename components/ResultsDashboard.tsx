"use client"

import { useState } from 'react'
import {
  Brain,
  BarChart3,
  MessageCircle,
  TrendingUp,
  Briefcase,
  GraduationCap,
  User,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  LayoutDashboard,
  Target,
  BookOpen,
  Compass,
  Sparkles,
} from 'lucide-react'
import { ScoreProfile, AdaptiveAssessmentState, Career } from '@/lib/types'
import { CareerCoachInline } from '@/components/CareerCoachInline'
import { CareerRadarChart } from '@/components/CareerRadarChart'
import { getQuestionById } from '@/lib/questions'
import { getRecommendedSubjects } from '@/lib/subjects_recommendation'
import { APP_CONFIG } from '@/lib/config'

// ─── Types ────────────────────────────────────────────────────────────────────

type DashTab = 'overview' | 'personality' | 'careers' | 'insights' | 'growth' | 'coach'

interface ResultsDashboardProps {
  scores: ScoreProfile
  matchedCareers: (Career & { match: number; rank: number })[]
  topStrengths: { name: string; score: number }[]
  topMotivations: { name: string; score: number }[]
  topRIASEC: string[]
  archetype: string
  userName: string
  userStage: 'school' | 'college' | 'university' | ''
  adaptiveState: AdaptiveAssessmentState
  authUser: { id: string; name: string; email?: string; avatar?: string | null } | null
  isReturningUser: boolean
  showUserMenu: boolean
  setShowUserMenu: (v: boolean) => void
  onLogout: () => void
  userAge: string
  userGender: string
  userSchool: string
  userGoals: string
  isCoachOpen: boolean
  setIsCoachOpen: (v: boolean) => void
  showClinicalAudit: boolean
  setShowClinicalAudit: (v: boolean) => void
  radarData: { subject: string; score: number; fullMark: number }[]
  proximityData: { name: string; score: number }[]
  showDebug: boolean
  setShowDebug: (v: boolean) => void
  onetScores: Record<string, number> | null
  onStartOnet: () => void
  currentSubjects?: string[]
  currentDegree?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const tabs: { id: DashTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',     label: 'Dashboard',    icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'personality',  label: 'Personality',  icon: <User className="w-4 h-4" /> },
  { id: 'careers',      label: 'Careers',      icon: <Briefcase className="w-4 h-4" /> },
  { id: 'insights',     label: 'Insights',     icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'growth',       label: 'Growth Plan',  icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'coach',        label: 'AI Coach',     icon: <MessageCircle className="w-4 h-4" /> },
]

const RIASEC_COLORS: Record<string, string> = {
  R: 'bg-emerald-500',
  I: 'bg-blue-500',
  A: 'bg-purple-500',
  S: 'bg-yellow-400',
  E: 'bg-red-500',
  C: 'bg-slate-400',
}

const RIASEC_TEXT_COLORS: Record<string, string> = {
  R: 'text-emerald-600',
  I: 'text-blue-600',
  A: 'text-purple-600',
  S: 'text-yellow-600',
  E: 'text-red-600',
  C: 'text-slate-500',
}

const RIASEC_BG_LIGHT: Record<string, string> = {
  R: 'bg-emerald-50 border-emerald-200',
  I: 'bg-blue-50 border-blue-200',
  A: 'bg-purple-50 border-purple-200',
  S: 'bg-yellow-50 border-yellow-200',
  E: 'bg-red-50 border-red-200',
  C: 'bg-slate-50 border-slate-200',
}

const RIASEC_LABELS: Record<string, string> = {
  R: 'Hands-On',
  I: 'Analytical',
  A: 'Creative',
  S: 'People-Oriented',
  E: 'Leadership',
  C: 'Organised',
}

// ─── Data generators ──────────────────────────────────────────────────────────

function getPersonalityOneLiner(topRIASEC: string[]): string {
  const [a, b] = topRIASEC
  const map: Record<string, string> = {
    IA: 'You are a curious problem-solver who uses creativity to investigate and understand the world.',
    IS: 'You are an analytical thinker who uses insights to genuinely help others grow.',
    IE: 'You are a sharp strategist who combines deep thinking with the drive to lead.',
    IC: 'You are a precise researcher who brings structure and rigour to complex problems.',
    IR: 'You are a technical mind who enjoys building and understanding how things work.',
    AI: 'You are a thoughtful creator who analyses deeply and connects meaningfully with people.',
    AS: 'You are an expressive, empathetic creator who connects deeply through your work.',
    AE: 'You are a visionary who blends creative flair with the confidence to pitch and lead.',
    AC: 'You are a detail-oriented artist who brings precision and beauty to everything you create.',
    AR: 'You are a hands-on creator who loves building things that are functional and beautiful.',
    SI: 'You are a thoughtful helper who uses knowledge and empathy to support those around you.',
    SA: 'You are a warm communicator who uses creativity to connect and inspire others.',
    SE: 'You are a natural people-person who leads with heart and brings teams together.',
    SC: 'You are an organised, caring individual who thrives helping people through clear systems.',
    SR: 'You are a practical, community-minded person who helps through hands-on action.',
    EI: 'You are a driven leader who uses sharp thinking to turn ideas into results.',
    EA: 'You are a charismatic visionary who leads with creativity and inspires others.',
    ES: 'You are an energetic, people-focused leader who motivates teams and drives impact.',
    EC: 'You are a disciplined entrepreneur who combines ambition with precision.',
    ER: 'You are an action-oriented achiever who leads from the front and gets things done.',
    CI: 'You are a methodical analyst who brings order and logic to complex information.',
    CA: 'You are a structured creative who produces polished, detailed work.',
    CS: 'You are a reliable organiser who keeps teams and systems running smoothly.',
    CE: 'You are a disciplined, results-driven organiser who builds systems that scale.',
    CR: 'You are a precise operator who ensures quality and consistency in everything.',
    RI: 'You are a technical problem-solver who loves understanding and fixing how things work.',
    RA: 'You are a hands-on creative who brings original ideas to life through practical skills.',
    RS: 'You are a grounded, practical helper who supports others through action.',
    RE: 'You are a driven, practical achiever who leads teams to build and deliver results.',
    RC: 'You are a reliable professional who executes with precision and consistency.',
  }
  return map[`${a}${b}`] ?? `You are driven by ${RIASEC_LABELS[a] ?? 'curiosity'} and apply it to everything you do.`
}

function getProfileTags(topRIASEC: string[]): string[] {
  const tagMap: Record<string, string[]> = {
    R: ['Hands-On', 'Practical', 'Technical'],
    I: ['Analytical', 'Curious', 'Research-Driven'],
    A: ['Creative', 'Expressive', 'Original'],
    S: ['Empathetic', 'People-Oriented', 'Collaborative'],
    E: ['Leader', 'Ambitious', 'Persuasive'],
    C: ['Organised', 'Detail-Oriented', 'Precise'],
  }
  const [first, second] = topRIASEC
  return [...(tagMap[first]?.slice(0, 2) ?? []), ...(tagMap[second]?.slice(0, 1) ?? [])]
}

function getTodayInsight(topRIASEC: string[]): { title: string; body: string } {
  const map: Record<string, { title: string; body: string }> = {
    R: { title: 'Your Hands-On Edge', body: 'Your strength is turning ideas into reality. The world needs people who can actually build things — not just talk about them. Look for roles where you create tangible outcomes.' },
    I: { title: 'Your Analytical Advantage', body: 'You think deeply where others think quickly. This is rare and valuable. The best careers for you are ones where deep thinking is the job — not just a nice-to-have.' },
    A: { title: 'Your Creative Power', body: "Your ability to see things differently isn't a soft skill — it's a competitive advantage. The most sought-after professionals combine domain expertise with creative thinking." },
    S: { title: 'Your People Superpower', body: 'You may feel overloaded sometimes — focus on one task at a time. Your best work comes when you balance helping others with time for quiet reflection.' },
    E: { title: 'Your Leadership Instinct', body: "You're wired to influence and lead. Channel this toward building something — a project, a team, a business. Leadership without direction is just restlessness." },
    C: { title: 'Your Precision Advantage', body: 'In a world of chaos, your ability to create order is invaluable. The best organisations are built by people who can design and maintain systems that actually work.' },
  }
  return map[topRIASEC[0]] ?? map['I']
}

function getTraitDetails(code: string): string[] {
  const map: Record<string, string[]> = {
    R: ['Technical', 'Hands-On', 'Mechanical'],
    I: ['Analytical', 'Curious', 'Problem Solver'],
    A: ['Creative', 'Imaginative', 'Expressive'],
    S: ['Empathetic', 'Supportive', 'Communicative'],
    E: ['Persuasive', 'Goal-Oriented', 'Confident'],
    C: ['Organised', 'Detailed', 'Systematic'],
  }
  return map[code] ?? []
}

function getStrugglePoints(topRIASEC: string[]): { title: string; desc: string }[] {
  const map: Record<string, { title: string; desc: string }> = {
    R: { title: 'May avoid open-ended tasks', desc: 'Prefer clear goals over ambiguous, people-heavy situations.' },
    I: { title: 'May overthink decisions', desc: 'Analysis can slow you down — practice making quick, good-enough calls.' },
    A: { title: 'May find rigid structure draining', desc: 'Repetitive or rule-bound environments can feel suffocating.' },
    S: { title: 'May avoid necessary conflict', desc: 'Harmony matters to you, but sometimes direct feedback is more helpful.' },
    E: { title: 'May take on too much', desc: 'Ambition is a strength — but burnout is real. Pace yourself.' },
    C: { title: 'May struggle with ambiguity', desc: 'Rapidly changing plans or unclear guidelines can feel unsettling.' },
  }
  return topRIASEC.slice(0, 3).map(c => map[c]).filter(Boolean)
}

function getGrowthRecs(topRIASEC: string[], topCareerName: string): { icon: string; title: string; desc: string }[] {
  const map: Record<string, { icon: string; title: string; desc: string }[]> = {
    I: [
      { icon: '🎯', title: 'Build Decision-Making Skills', desc: 'Practice quick, confident choices.' },
      { icon: '📚', title: 'Develop Structured Routines', desc: 'Balance analysis with consistency.' },
      { icon: '🔍', title: `Explore ${topCareerName}`, desc: 'Find 3 experts in the field to follow.' },
    ],
    A: [
      { icon: '🎨', title: 'Build a Creative Portfolio', desc: 'Document 3 projects this month.' },
      { icon: '🛠️', title: 'Develop Technical Skills', desc: 'Balance creativity with craft.' },
      { icon: '🔍', title: `Study ${topCareerName} Leaders`, desc: 'Find 3 professionals to follow.' },
    ],
    S: [
      { icon: '🤝', title: 'Seek People-Centred Roles', desc: 'You thrive where you can connect.' },
      { icon: '📋', title: 'Develop Structured Routines', desc: 'Balance connection with consistency.' },
      { icon: '🔍', title: `Research ${topCareerName}`, desc: 'Understand the day-to-day realities.' },
    ],
    E: [
      { icon: '🚀', title: 'Build Leadership Experience', desc: 'Lead one project or team this term.' },
      { icon: '👂', title: 'Develop Listening Skills', desc: 'Balance persuasion with empathy.' },
      { icon: '🤝', title: `Network in ${topCareerName}`, desc: 'Connect with 3 professionals.' },
    ],
    R: [
      { icon: '🔧', title: 'Build Technical Expertise', desc: 'Master one hands-on skill this month.' },
      { icon: '💬', title: 'Develop Communication Skills', desc: 'Present your work to others.' },
      { icon: '🔍', title: `Find ${topCareerName} Mentors`, desc: 'Learn from practitioners in the field.' },
    ],
    C: [
      { icon: '🔄', title: 'Develop Flexible Thinking', desc: 'Practice adapting to new situations.' },
      { icon: '📊', title: 'Build Systems & Processes', desc: 'Create one useful workflow this week.' },
      { icon: '🗺️', title: `Map Your Path to ${topCareerName}`, desc: 'List the exact steps to get there.' },
    ],
  }
  return map[topRIASEC[0]] ?? map['I']
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getRiasecBars(scores: ScoreProfile) {
  const fields = [
    { key: 'riasec_realistic', code: 'R' },
    { key: 'riasec_investigative', code: 'I' },
    { key: 'riasec_artistic', code: 'A' },
    { key: 'riasec_social', code: 'S' },
    { key: 'riasec_enterprising', code: 'E' },
    { key: 'riasec_conventional', code: 'C' },
  ]
  return fields
    .map(({ key, code }) => ({
      code,
      label: RIASEC_LABELS[code],
      score: Math.round((scores as unknown as Record<string, number>)[key] ?? 0),
    }))
    .sort((a, b) => b.score - a.score)
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  userName,
  archetype,
  topRIASEC,
  scores,
  radarData,
  matchedCareers,
  onetScores,
  onStartOnet,
  setActiveTab,
  userStage,
}: {
  userName: string
  archetype: string
  topRIASEC: string[]
  scores: ScoreProfile
  radarData: { subject: string; score: number; fullMark: number }[]
  matchedCareers: (Career & { match: number; rank: number })[]
  onetScores: Record<string, number> | null
  onStartOnet: () => void
  setActiveTab: (t: DashTab) => void
  userStage: 'school' | 'college' | 'university' | ''
}) {
  const subjectRecs = getRecommendedSubjects(topRIASEC)
  const oneLiner = getPersonalityOneLiner(topRIASEC)
  const tags = getProfileTags(topRIASEC)
  const insight = getTodayInsight(topRIASEC)
  const struggles = getStrugglePoints(topRIASEC)
  const topCareerName = matchedCareers[0]?.name ?? 'your top career'
  const growthRecs = getGrowthRecs(topRIASEC, topCareerName)
  const riasecBars = getRiasecBars(scores)
  const top3 = topRIASEC.slice(0, 3)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

      {/* ── Hero archetype card ───────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#0f1629] via-[#131830] to-[#1a1040] rounded-2xl p-6 sm:p-8 overflow-hidden text-white">
        {/* Background orb */}
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-indigo-600/15 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-[60px]" />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Left: greeting + archetype */}
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-1">{greeting}, {userName || 'there'} —</p>
            <p className="text-slate-500 text-xs uppercase tracking-[0.18em] font-bold mb-2">Your personality type</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none mb-3">
              The <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">{archetype}</span>
            </h1>
            {/* Holland Code pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {top3.map((code) => (
                <div key={code} className={`border rounded-lg px-3 py-1.5 ${RIASEC_BG_LIGHT[code].replace('bg-', 'bg-opacity-20 bg-').replace('border-', 'border-opacity-30 border-')}`}
                  style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' }}>
                  <span className={`text-sm font-black ${RIASEC_TEXT_COLORS[code].replace('600','400').replace('500','400')}`}>{code}</span>
                  <span className="text-slate-400 text-xs ml-1.5">{RIASEC_LABELS[code]}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic max-w-xs">&ldquo;{oneLiner}&rdquo;</p>
          </div>

          {/* Right: tags + insight snippet */}
          <div className="sm:border-l sm:border-white/8 sm:pl-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Trait Profile</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white/6 border border-white/8 text-slate-300 text-xs rounded-lg font-semibold">{tag}</span>
                ))}
              </div>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400/80">Today&apos;s Insight</p>
              </div>
              <p className="text-sm font-black text-white leading-tight mb-1">{insight.title}</p>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{insight.body}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Academic Pathway */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-black text-slate-900">
            {userStage === 'school' ? 'Your Subject Roadmap' : 'Recommended University Majors'}
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">{subjectRecs.justification}</p>

        {userStage === 'school' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* O Level */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">O Level Electives</p>
              <div className="flex flex-wrap gap-1.5">
                {subjectRecs.oLevelElectives.map(sub => (
                  <span key={sub} className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 font-semibold text-xs rounded-lg">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            {/* A Level */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
              <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2">A Level — Pick These 3</p>
              <div className="flex flex-wrap gap-1.5">
                {subjectRecs.aLevelSubjects.map(sub => (
                  <span key={sub} className="px-2.5 py-1 bg-white border border-purple-200 text-purple-700 font-semibold text-xs rounded-lg">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
            {/* FSc equivalent */}
            <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 mt-0.5">FSc / Matric</span>
              <span className="text-xs text-slate-600 font-medium">{subjectRecs.fscStream}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjectRecs.universityMajors.map(sub => (
              <span key={sub} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-sm rounded-lg">
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Middle row: RIASEC Profile + Top Career Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* RIASEC Profile (radar + bars) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">RIASEC Profile</h2>
            <button onClick={() => setActiveTab('personality')} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <CareerRadarChart data={radarData} />
          <p className="text-center text-xs text-slate-400 mt-2">Hover each area to see your traits</p>
        </div>

        {/* Top Career Matches */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">Top Career Matches</h2>
            <button onClick={() => setActiveTab('careers')} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {onetScores ? (
            <div className="space-y-3 flex-1">
              {matchedCareers.slice(0, 3).map((career) => (
                <div key={career.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${RIASEC_BG_LIGHT[topRIASEC[0]]} flex items-center justify-center shrink-0`}>
                    <Briefcase className={`w-4 h-4 ${RIASEC_TEXT_COLORS[topRIASEC[0]]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-slate-900 truncate">{career.name}</p>
                      <span className="text-blue-600 font-black text-sm shrink-0">{career.match}%</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{career.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Complete Part 2</p>
                <p className="text-xs text-slate-500 mt-1">60 questions · ~15 min to unlock your full career matches</p>
              </div>
              <button
                onClick={onStartOnet}
                className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Career Profiler →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trait Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {top3.map((code) => {
          const bar = riasecBars.find(b => b.code === code)
          const traits = getTraitDetails(code)
          return (
            <div key={code} className={`border rounded-2xl p-5 ${RIASEC_BG_LIGHT[code]}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-black ${RIASEC_TEXT_COLORS[code]}`}>{RIASEC_LABELS[code]}</span>
                <span className={`text-lg font-black ${RIASEC_TEXT_COLORS[code]}`}>{bar?.score ?? 0}%</span>
              </div>
              <ul className="space-y-1.5">
                {traits.map(t => (
                  <li key={t} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${RIASEC_COLORS[code]} shrink-0`} />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setActiveTab('personality')}
                className={`mt-3 text-xs font-semibold ${RIASEC_TEXT_COLORS[code]} flex items-center gap-1 hover:underline`}
              >
                View Details <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Bottom row: Struggle + Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Where You Might Struggle */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">Where You Might Struggle</h2>
            <button onClick={() => setActiveTab('insights')} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <ul className="space-y-3">
            {struggles.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Recommendations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-900">Growth Recommendations</h2>
            <button onClick={() => setActiveTab('growth')} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View Plan <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <ul className="space-y-3">
            {growthRecs.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0 leading-none">{r.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Coach mini */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">AI Coach</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">New Chat</span>
          </div>
          <button onClick={() => setActiveTab('coach')} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
            Open <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 mb-3 space-y-2">
          <p className="text-sm text-slate-700">Hi {userName}! I&apos;m your AI career coach. Ask me anything about your personality, career path, or growth.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[`What career suits me best?`, `How do I get into ${topCareerName}?`, 'What are my top strengths?'].map(q => (
            <button
              key={q}
              onClick={() => setActiveTab('coach')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Personality Tab ───────────────────────────────────────────────────────────

function PersonalityTab({
  archetype,
  topRIASEC,
  topStrengths,
  topMotivations,
  radarData,
  scores,
  adaptiveState,
  showClinicalAudit,
  setShowClinicalAudit,
  setIsCoachOpen,
}: {
  archetype: string
  topRIASEC: string[]
  topStrengths: { name: string; score: number }[]
  topMotivations: { name: string; score: number }[]
  radarData: { subject: string; score: number; fullMark: number }[]
  scores: ScoreProfile
  adaptiveState: AdaptiveAssessmentState
  showClinicalAudit: boolean
  setShowClinicalAudit: (v: boolean) => void
  setIsCoachOpen: (v: boolean) => void
}) {
  const riasecBars = getRiasecBars(scores)
  const oneLiner = getPersonalityOneLiner(topRIASEC)
  const tags = getProfileTags(topRIASEC)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white space-y-4">
        <div className="flex items-end gap-4 mb-2">
          {topRIASEC.slice(0, 3).map(code => (
            <div key={code} className="text-center">
              <span className="text-5xl font-black text-white/90">{code}</span>
              <div className="mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                {RIASEC_LABELS[code]}
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-black">{archetype}</h1>
        <p className="text-blue-100 text-sm leading-relaxed italic">&ldquo;{oneLiner}&rdquo;</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">{tag}</span>
          ))}
        </div>
        <button
          onClick={() => setIsCoachOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-300 text-blue-100 text-sm font-medium hover:bg-blue-500/30 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask your Coach
        </button>
      </div>

      {/* RIASEC bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">RIASEC Interest Profile</h2>
        <div className="space-y-3 mb-6">
          {riasecBars.map(({ code, label, score }) => (
            <div key={code} className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${RIASEC_COLORS[code]}`} />
              <span className="text-sm text-slate-700 w-28 shrink-0">{label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-full rounded-full ${RIASEC_COLORS[code]}`} style={{ width: `${Math.min(score, 100)}%` }} />
              </div>
              <span className={`text-sm font-black w-8 text-right ${RIASEC_TEXT_COLORS[code]}`}>{score}</span>
            </div>
          ))}
        </div>
        <CareerRadarChart data={radarData} />
      </div>

      {/* Strengths */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">Your Strengths</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topStrengths.slice(0, 3).map(({ name, score }) => (
            <div key={name} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-600">{Math.round(score)}</p>
              <p className="text-sm font-semibold text-slate-700 capitalize mt-1">{name.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">What Drives You</h2>
        <ol className="space-y-3">
          {topMotivations.slice(0, 3).map(({ name, score }, idx) => (
            <li key={name} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-black flex items-center justify-center shrink-0">{idx + 1}</span>
              <span className="text-slate-800 font-medium capitalize">{name.replace(/_/g, ' ')}</span>
              <span className="ml-auto text-sm text-slate-500">{Math.round(score)}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Clinical Audit */}
      <div>
        <button
          onClick={() => setShowClinicalAudit(!showClinicalAudit)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-2"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showClinicalAudit ? 'rotate-90' : ''}`} />
          Clinical Audit ({adaptiveState.responses.length} responses)
        </button>
        {showClinicalAudit && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 overflow-x-auto">
            <h2 className="text-lg font-black text-slate-900 mb-4">Response Audit</h2>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-2 font-semibold text-slate-500 pr-4">Question</th>
                  <th className="pb-2 font-semibold text-slate-500 pr-4">Score</th>
                  <th className="pb-2 font-semibold text-slate-500">Dimensions</th>
                </tr>
              </thead>
              <tbody>
                {adaptiveState.responses.map((response) => {
                  const q = getQuestionById(response.question_id)
                  return (
                    <tr key={response.question_id} className="border-b border-slate-50">
                      <td className="py-1.5 pr-4 text-slate-700 max-w-xs">{q ? q.text : `Q${response.question_id}`}</td>
                      <td className="py-1.5 pr-4 font-semibold text-slate-800">{response.response_value}</td>
                      <td className="py-1.5 text-slate-500">{q ? q.dimensions.map(d => `${d.dimension}(${d.weight})`).join(', ') : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── O*NET Locked Teaser ──────────────────────────────────────────────────────

function OnetLockedTeaser({ onStartOnet, matchedCareers }: { onStartOnet: () => void; matchedCareers: (Career & { match: number; rank: number })[] }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center space-y-4">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
          <Briefcase className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Part 2 of 2</p>
          <h2 className="text-2xl font-black mb-2">Unlock Your Full Career Matches</h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-md mx-auto">
            Complete the O*NET Career Profiler — 60 activities, ~15 minutes — to get career matches mapped to 800+ real occupations validated by the U.S. Department of Labor.
          </p>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-blue-200">
          <span>✦ 60 questions</span><span>✦ ~15 minutes</span><span>✦ 800+ career paths</span>
        </div>
        <button onClick={onStartOnet} className="bg-white text-blue-700 font-black px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
          Start Career Profiler →
        </button>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-6 mb-3">Preview — Complete Part 2 to unlock</p>
      {matchedCareers.slice(0, 3).map((career) => (
        <div key={career.id} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <span className="text-slate-400 text-sm font-semibold">🔒 Complete Part 2 to unlock</span>
          </div>
          <div className="flex items-start justify-between gap-4 opacity-40">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center shrink-0">#{career.rank}</span>
              <div>
                <p className="font-bold text-lg text-slate-900">{career.name}</p>
                <p className="text-sm text-slate-500">{career.category}</p>
              </div>
            </div>
            <p className="text-2xl font-black text-blue-600">{career.match}%</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Careers Tab ──────────────────────────────────────────────────────────────

function getUserProfileParagraph(scores: ScoreProfile) {
  const userTraits = [
    { key: 'realistic', score: (scores as unknown as Record<string, number>).riasec_realistic || 0 },
    { key: 'investigative', score: (scores as unknown as Record<string, number>).riasec_investigative || 0 },
    { key: 'artistic', score: (scores as unknown as Record<string, number>).riasec_artistic || 0 },
    { key: 'social', score: (scores as unknown as Record<string, number>).riasec_social || 0 },
    { key: 'enterprising', score: (scores as unknown as Record<string, number>).riasec_enterprising || 0 },
    { key: 'conventional', score: (scores as unknown as Record<string, number>).riasec_conventional || 0 },
  ].sort((a, b) => b.score - a.score);

  const highest = userTraits[0].key;
  const second = userTraits[1].key;
  const lowest = userTraits[5].key;

  const thinkingMap: Record<string, string> = {
    investigative: 'thinks deeply and analytically about problems',
    artistic: 'looks for original and creative solutions',
    realistic: 'focuses on practical, tangible results',
    social: 'leads with empathy and focuses on human needs',
    enterprising: 'thinks strategically toward big-picture goals',
    conventional: 'thinks systematically and values clear structure'
  };

  const workPrefMap: Record<string, string> = {
    social: 'prefers independent, focused work',
    enterprising: 'prefers executing well over managing others',
    conventional: 'thrives in dynamic, unstructured environments',
    realistic: 'prefers conceptual or office-based environments',
    artistic: 'enjoys clear-cut, predictable workflows',
    investigative: 'prefers taking action over prolonged analysis'
  };

  const enjoyMap: Record<string, string> = {
    investigative: 'solving complex puzzles',
    artistic: 'expressing ideas creatively',
    realistic: 'building systems and solving practical problems',
    social: 'helping and supporting others',
    enterprising: 'driving projects and leading outcomes',
    conventional: 'organizing information and creating order'
  };

  const adjMap: Record<string, string> = {
    investigative: 'highly analytical',
    artistic: 'highly creative',
    realistic: 'highly practical',
    social: 'highly collaborative',
    enterprising: 'highly ambitious',
    conventional: 'highly structured'
  };

  return `From your answers, you come across as someone who ${thinkingMap[highest]}, who ${workPrefMap[lowest]}, and who truly enjoys ${enjoyMap[second]}. You tend to combine a ${adjMap[highest]} approach with a ${adjMap[second]} focus. Because of this, the careers below are strong matches for you.`;
}

function getCareerFitExplanation(career: Career, scores: ScoreProfile) {
  const userTraits = [
    { key: 'realistic', label: 'hands-on' },
    { key: 'investigative', label: 'analytical' },
    { key: 'artistic', label: 'creative' },
    { key: 'social', label: 'people-oriented' },
    { key: 'enterprising', label: 'leadership-focused' },
    { key: 'conventional', label: 'detail-oriented' },
  ].map(t => ({ ...t, score: (scores as unknown as Record<string, number>)[`riasec_${t.key}`] || 0 }))
   .sort((a, b) => b.score - a.score);

  const topUserTraits = userTraits.slice(0, 3);
  
  const careerTraits = Object.entries(career.riasec_profile)
    .sort(([, a], [, b]) => (b as number) - (a as number));
    
  const topCareerTraitKeys = careerTraits.slice(0, 3).map(([k]) => k);
  const lowestCareerTraitKey = careerTraits[careerTraits.length - 1][0];

  const overlaps = topUserTraits.filter(t => topCareerTraitKeys.includes(t.key));
  const matchTraits = overlaps.length >= 2 ? overlaps : topUserTraits.slice(0, 2);
  
  const identityMatch = `You naturally lean towards ${matchTraits[0].label} and ${matchTraits[1]?.label || 'practical'} work, which aligns strongly with this career.`;

  let workStyle = "This career provides a balanced, engaging environment.";
  if (lowestCareerTraitKey === 'social') workStyle = "This suits people who prefer focused, independent work.";
  else if (lowestCareerTraitKey === 'enterprising') workStyle = "This fits people who prefer executing well rather than managing others.";
  else if (lowestCareerTraitKey === 'conventional') workStyle = "This suits people who thrive in dynamic, unstructured environments.";
  else if (lowestCareerTraitKey === 'realistic') workStyle = "This works well for people who prefer conceptual or office-based work over physical tasks.";
  else if (lowestCareerTraitKey === 'artistic') workStyle = "This fits people who enjoy structured, predictable, and clear-cut environments.";
  else if (lowestCareerTraitKey === 'investigative') workStyle = "This is great for people who prefer action and practical results over deep analysis.";

  const skill1 = career.required_skills[0]?.name?.toLowerCase() || 'problem solving';
  const skill2 = career.required_skills[1]?.name?.toLowerCase() || 'critical thinking';
  const realWorldFit = `You are likely to enjoy tasks involving ${skill1} and ${skill2}.`;

  const task = career.typical_tasks[0]?.toLowerCase().replace(/\.$/, '') || 'the day-to-day routine';
  const caution = `You should explore whether you enjoy ${task} before committing.`;

  return { identityMatch, workStyle, realWorldFit, caution };
}

function getStageDirection(scores: ScoreProfile) {
  const userTraits = [
    { key: 'realistic', score: (scores as unknown as Record<string, number>).riasec_realistic || 0 },
    { key: 'investigative', score: (scores as unknown as Record<string, number>).riasec_investigative || 0 },
    { key: 'artistic', score: (scores as unknown as Record<string, number>).riasec_artistic || 0 },
    { key: 'social', score: (scores as unknown as Record<string, number>).riasec_social || 0 },
    { key: 'enterprising', score: (scores as unknown as Record<string, number>).riasec_enterprising || 0 },
    { key: 'conventional', score: (scores as unknown as Record<string, number>).riasec_conventional || 0 },
  ].sort((a, b) => b.score - a.score);

  const t1 = userTraits[0].key;
  const t2 = userTraits[1].key;
  const pair = [t1, t2].sort().join('_');

  const mappings: Record<string, { direction: string, schoolSubjects: string[], collegeSubjects: string[], broadPaths: string[] }> = {
    'artistic_conventional': { direction: 'Creative + Commerce', schoolSubjects: ['Business / Commerce', 'Computer or IT', 'Art / Design'], collegeSubjects: ['Accounting', 'Business Studies', 'Media / Design'], broadPaths: ['Design-related work', 'Business-related roles', 'Creative management'] },
    'artistic_investigative': { direction: 'Creative + Technology / Design', schoolSubjects: ['Science', 'Computer or IT', 'Art / Design'], collegeSubjects: ['Computer Science', 'Physics', 'Media / Design'], broadPaths: ['Technology-based paths', 'Design-related work', 'Research and innovation'] },
    'investigative_realistic': { direction: 'Science + Technical', schoolSubjects: ['Science', 'Computer or IT'], collegeSubjects: ['Physics', 'Mathematics', 'Computer Science'], broadPaths: ['Engineering or Technical roles', 'Science and Research', 'Technology-based paths'] },
    'conventional_investigative': { direction: 'Analytical + Business / Data', schoolSubjects: ['Science', 'Commerce', 'Computer or IT'], collegeSubjects: ['Mathematics', 'Economics', 'Accounting'], broadPaths: ['Data and Analytics roles', 'Business-related roles', 'Finance and Operations'] },
    'conventional_enterprising': { direction: 'Commerce + Business', schoolSubjects: ['Commerce', 'Humanities'], collegeSubjects: ['Accounting', 'Business Studies', 'Economics'], broadPaths: ['Business-related roles', 'Management and Leadership', 'Finance and Operations'] },
    'investigative_social': { direction: 'Health / Psychology / Helping Professions', schoolSubjects: ['Science', 'Humanities'], collegeSubjects: ['Psychology', 'Sociology', 'Physics'], broadPaths: ['Healthcare and Medical roles', 'Psychology and Counseling', 'Research and Education'] },
    'enterprising_social': { direction: 'Communication + Leadership', schoolSubjects: ['Commerce', 'Humanities', 'Arts / Design'], collegeSubjects: ['Business Studies', 'Sociology', 'Media / Design'], broadPaths: ['Business-related roles', 'Communication and Media', 'Public Relations or HR'] },
    'conventional_realistic': { direction: 'Technical / Practical Skills', schoolSubjects: ['Computer or IT', 'Science'], collegeSubjects: ['Computer Science', 'Mathematics'], broadPaths: ['Technology-based paths', 'Engineering or Technical roles', 'Operations and Logistics'] },
    'artistic_social': { direction: 'Media / Communication / Design', schoolSubjects: ['Arts / Design', 'Humanities'], collegeSubjects: ['Media / Design', 'Sociology', 'Psychology'], broadPaths: ['Design-related work', 'Communication and Media', 'Education and Counseling'] },
  };

  return mappings[pair] || { direction: 'Balanced Exploration Path', schoolSubjects: ['Science', 'Commerce', 'Arts / Design'], collegeSubjects: ['Business Studies', 'Computer Science', 'Psychology'], broadPaths: ['Technology-based paths', 'Business-related roles', 'Design-related work'] };
}

function CareersTab({ matchedCareers, scores, userStage, userGoals, currentSubjects, currentDegree }: { matchedCareers: (Career & { match: number; rank: number })[]; scores: ScoreProfile; onetScores?: Record<string, number>; userStage?: 'school' | 'college' | 'university' | ''; userGoals?: string; currentSubjects?: string[]; currentDegree?: string }) {
  const profileParagraph = getUserProfileParagraph(scores);
  
  const isSchool = userStage === "school";
  const isCollege = userStage === "college";
  const isUniversity = userStage === "university" || (!isSchool && !isCollege);
  
  const topCareer = matchedCareers[0];
  const { direction, collegeSubjects, broadPaths } = getStageDirection(scores);
  const { identityMatch: topIdentity } = topCareer ? getCareerFitExplanation(topCareer, scores) : { identityMatch: '' };

  const top3Traits = [
    { code: 'R', score: scores.riasec_realistic },
    { code: 'I', score: scores.riasec_investigative },
    { code: 'A', score: scores.riasec_artistic },
    { code: 'S', score: scores.riasec_social },
    { code: 'E', score: scores.riasec_enterprising },
    { code: 'C', score: scores.riasec_conventional },
  ].sort((a, b) => b.score - a.score).slice(0, 3).map(t => t.code);

  const riasecSubjectMeaning: Record<string, string> = {
    R: 'using tools like computers or practical tasks',
    I: 'analytical thinking, research, and problem solving',
    A: 'creative thinking and design',
    S: 'understanding people, communication, or societal topics',
    E: 'leadership, business concepts, and public speaking',
    C: 'structured and organized work'
  };

  const riasecTryThis: Record<string, string> = {
    R: 'Explore a basic coding or practical tool tutorial',
    I: 'Try a logic puzzle or research a new topic',
    A: 'Design something simple using Canva',
    S: 'Help a friend understand something or join a group activity',
    E: 'Manage a small budget or plan a small event',
    C: 'Organize your digital workspace or create a clear schedule'
  };

  const ctaTitle = isSchool ? "Want to explore this further?" : isCollege ? "Need help choosing the right direction?" : "Want clarity on your next step?";
  const ctaText = isSchool ? "Talk to a career advisor to better understand your strengths and what subjects might suit you." : isCollege ? "Get one-to-one guidance on your subjects, degree options, and career path." : "Get guidance on specialization, skills, internships, and career direction.";
  const ctaButton = isSchool ? "Talk to an Advisor" : "Book Your Session";

  const rankLabels = [
    { title: 'Gold Match', subtitle: 'Best Fit', color: 'text-amber-600', barBg: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🥇' },
    { title: 'Silver Match', subtitle: 'Strong Alternative', color: 'text-slate-500', barBg: 'bg-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', icon: '🥈' },
    { title: 'Bronze Match', subtitle: 'Alternative Direction', color: 'text-orange-700', barBg: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🥉' }
  ];

  // University specific rendering (the original one)
  if (isUniversity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* 1. Your Profile */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="text-2xl">👋</span> Your Profile
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed font-medium">{profileParagraph}</p>
        </section>

        {/* 2. Your Current Path */}
        {(currentDegree && currentDegree.trim().length > 0) && (
          <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Your Current Path</h2>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-lg font-bold text-slate-800">You are currently studying: <span className="text-blue-600">{currentDegree}</span></p>
              <p className="mt-2 text-slate-600">Use these results to think about how you want to shape your direction — through specialization, skills, internships, projects, or adjacent roles.</p>
              <p className="mt-2 text-slate-600 font-medium">This is not about restarting your path; it is about choosing the direction that fits you best from here.</p>
            </div>
          </section>
        )}

        {/* 3. Where you should start */}
        {topCareer && (
          <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 space-y-5 text-white shadow-lg shadow-blue-600/20">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" /> Where you should start
            </h2>
            <p className="text-white/90 text-lg">If you had to pick one path to explore first, this would be it:</p>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl md:text-2xl font-black text-white flex flex-wrap items-center gap-x-2 gap-y-1">
                🥇 {topCareer.name} <span className="text-blue-200 text-sm font-semibold md:ml-2">— Best Starting Point</span>
              </h3>
              <div className="mt-3 space-y-2">
                <p className="text-blue-50 text-sm font-medium">{topIdentity}</p>
                <p className="text-emerald-300 text-sm font-semibold">Given your profile, this path offers the highest likelihood of long-term success and daily satisfaction.</p>
              </div>
            </div>
          </section>
        )}

        {/* 5. Transition Line */}
        <div className="pt-4 pb-2 border-t border-slate-200">
          <p className="text-slate-800 text-lg font-semibold">Based on this, here are the career paths where people like you tend to do well:</p>
        </div>

        {/* 3 & 4. Career Cards */}
        <section className="space-y-6">
          {matchedCareers.slice(0, 3).map((career, idx) => {
            const label = rankLabels[idx] || rankLabels[2];
            const { identityMatch, workStyle, realWorldFit, caution } = getCareerFitExplanation(career, scores);
              
            return (
              <div key={career.id} className={`bg-white border-2 ${label.border} rounded-2xl p-6 space-y-4`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-xs font-black uppercase tracking-widest ${label.color} mb-1 flex items-center gap-1.5`}>
                      {label.icon} {label.title} — {label.subtitle}
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 leading-tight">{career.name}</h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-3xl font-black ${label.color}`}>{career.match}%</p>
                  </div>
                </div>
                
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${label.barBg}`} style={{ width: `${career.match}%` }} />
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5 font-bold">→</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Why this fits you</p>
                      <p className="text-sm text-slate-800">{identityMatch}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5 font-bold">→</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">What your work will feel like</p>
                      <p className="text-sm text-slate-800">{workStyle}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5 font-bold">→</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">What you&apos;ll actually do</p>
                      <p className="text-sm text-slate-800">{realWorldFit}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5 font-bold">→</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Before you commit</p>
                      <p className="text-sm text-slate-800">{caution}</p>
                    </div>
                  </div>
                </div>

                {career.education_pathways.length > 0 && (
                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <GraduationCap className="w-4 h-4" />
                      {career.education_pathways[0].level.charAt(0).toUpperCase() + career.education_pathways[0].level.slice(1)}: {career.education_pathways[0].field}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* Advisor CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 border-none rounded-3xl p-8 md:p-10 space-y-6 text-white shadow-2xl mt-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MessageCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-white">{ctaTitle}</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {ctaText}
            </p>
            <div className="pt-4">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Booking system coming soon!"); }} className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                {ctaButton}
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // School or College Rendering
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Your Profile */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
          <span className="text-2xl">👋</span> Your Profile
        </h2>
        <p className="text-slate-700 text-lg leading-relaxed font-medium">{profileParagraph}</p>
      </section>

      {/* 2. Your Current Path */}
      {(isSchool && currentSubjects && currentSubjects.length > 0) ? (
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Your Current Subjects</h2>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-lg font-bold text-slate-800">You are currently studying: <span className="text-blue-600">{currentSubjects.join(', ')}</span></p>
            <p className="mt-2 text-slate-600">At this stage, your subjects are mainly a way to explore different areas. Some subjects may feel easier or more interesting than others — and that’s completely normal.</p>
          </div>
        </section>
      ) : (!isSchool && userGoals) ? (
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Your Current Path</h2>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-lg font-bold text-slate-800">You are currently studying: <span className="text-blue-600">{userGoals}</span></p>
          </div>
        </section>
      ) : null}

      {/* 3. Where you should start */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 space-y-5 text-white shadow-lg shadow-blue-600/20">
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" /> Where you should start
        </h2>
        <p className="text-white/90 text-lg">
          {isSchool ? "Right now, you don’t need to decide your career. What matters is noticing what feels natural and interesting to you." : "At this stage, your subject choices matter."}
        </p>
        
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-blue-100 mb-2">A good fit for you could be:</h3>
          <p className="text-2xl md:text-3xl font-black text-white">{direction}</p>
        </div>
      </section>

      {isSchool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What This Means For Your Studies */}
          <section className="bg-white border-2 border-emerald-100 rounded-3xl p-6 space-y-4 shadow-sm hover:border-emerald-200 transition-colors">
            <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" /> What This Means For Your Studies
            </h3>
            <p className="text-sm text-slate-700 font-medium">You may feel more comfortable in subjects that involve:</p>
            <ul className="space-y-3 mt-3">
              {top3Traits.map((t, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold mt-0.5">→</span>
                  <span className="text-slate-700 font-medium">{riasecSubjectMeaning[t]}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">These are the areas where you may enjoy learning more over time.</p>
          </section>

          {/* This Direction Can Open Paths Like */}
          <section className="bg-white border-2 border-indigo-100 rounded-3xl p-6 space-y-4 shadow-sm hover:border-indigo-200 transition-colors">
            <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" /> This Direction Can Open Paths Like
            </h3>
            <div className="flex flex-col gap-3 mt-2">
              {broadPaths.map((path, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-indigo-400 font-bold mt-0.5">→</span>
                  <span className="text-slate-700 font-medium">{path}</span>
                </div>
              ))}
            </div>
          </section>

          {/* What To Watch Out For */}
          <section className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> What To Watch Out For
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed font-medium">
              Some subjects may feel more tiring or less interesting — especially if they don’t match how you naturally like to think.
            </p>
            <p className="text-slate-700 text-sm leading-relaxed font-medium mt-2">
              That’s okay. This stage is about noticing what keeps your interest and what doesn’t.
            </p>
          </section>

          {/* Try This This Week */}
          <section className="bg-purple-50 border-2 border-purple-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-purple-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> Try This This Week
            </h3>
            <ul className="space-y-3">
              {top3Traits.map((t, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-500 font-bold mt-0.5">→</span>
                  <span className="text-slate-700 font-medium">{riasecTryThis[t]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subjects Section */}
          <section className="bg-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="font-black text-emerald-900 text-xl flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-500" /> Subjects That Fit You
            </h3>
            <p className="text-base text-slate-600 font-medium">These subjects will give you the most flexibility for your future options.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {collegeSubjects.map((subject, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-800 font-bold px-4 py-2 rounded-xl text-base border border-emerald-200">
                  {subject}
                </span>
              ))}
            </div>
          </section>

          {/* 2. Current Subjects */}
          {(currentSubjects && currentSubjects.length > 0) && (
            <section className="bg-white border-2 border-slate-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-slate-500" /> Your Current Subjects
              </h3>
              <p className="text-base text-slate-600 font-medium">You are currently studying:</p>
              <div className="flex flex-wrap gap-3 mt-2">
                {currentSubjects.map((subject, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-base border border-slate-200">
                    {subject}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 3. Reflection + dual-purpose line */}
          <section className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-500" /> A Quick Check On Your Direction
            </h3>
            <div className="space-y-4 text-slate-700 font-medium leading-relaxed">
              <p>
                If your current subjects are very different from the ones above, it may be worth reviewing your direction.
              </p>
              <p>
                This does not mean you made a bad choice, but it may explain why some subjects feel difficult, boring, or disconnected from your strengths.
              </p>
              <div className="bg-white/60 p-4 rounded-2xl border border-blue-100/50 mt-4">
                <p className="text-sm font-semibold text-blue-800 leading-relaxed">
                  If you&apos;re early in your A-levels or Intermediate, this helps you check your direction.<br/>
                  If you&apos;re closer to finishing, this shows where your subjects can take you.
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* College specific: Degree paths */}
            {matchedCareers[0]?.education_pathways && (
              <section className="bg-white border-2 border-indigo-100 rounded-3xl p-6 space-y-4 shadow-sm hover:border-indigo-200 transition-colors">
                <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-500" /> What This Can Lead To
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">→</span>
                    <span className="text-slate-700 font-medium">{matchedCareers[0].education_pathways[0]?.field || "Related Bachelor's degrees"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">→</span>
                    <span className="text-slate-700 font-medium">{matchedCareers[1]?.education_pathways?.[0]?.field || "Specialized tech or business fields"}</span>
                  </li>
                </ul>
              </section>
            )}

            {/* Future Directions Section */}
            <section className="bg-white border-2 border-blue-100 rounded-3xl p-6 space-y-4 shadow-sm hover:border-blue-200 transition-colors">
              <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" /> Career Directions This Can Lead To
              </h3>
              <ul className="space-y-3">
                {matchedCareers.slice(0, 3).map((career, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">→</span>
                    <span className="text-slate-700 font-medium">{career.category || career.name} — {career.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Before you decide */}
          <section className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Before You Decide
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">→</span>
                <span className="text-slate-700 font-medium">Check what subjects are required for the degrees you’re interested in.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">→</span>
                <span className="text-slate-700 font-medium">Pick subjects you can stay consistent with, not just what sounds good.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">→</span>
                <span className="text-slate-700 font-medium">If your current subjects are very different from these, it may be worth reviewing your direction. This does not mean you made a bad choice, but it may explain why some subjects feel difficult, boring, or disconnected from your strengths.</span>
              </li>
            </ul>
          </section>
        </div>
      )}

      {/* Advisor CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 border-none rounded-3xl p-8 md:p-10 space-y-6 text-white shadow-2xl mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageCircle className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-black text-white">{ctaTitle}</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            {ctaText}
          </p>
          <div className="pt-4">
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Booking system coming soon!"); }} className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
              {ctaButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Insights Tab ─────────────────────────────────────────────────────────────

function InsightsTab({ topRIASEC, scores, matchedCareers }: { topRIASEC: string[]; scores: ScoreProfile; matchedCareers: (Career & { match: number; rank: number })[] }) {
  const struggles = getStrugglePoints(topRIASEC)
  const topCareerName = matchedCareers[0]?.name ?? 'your top career'
  const growthRecs = getGrowthRecs(topRIASEC, topCareerName)
  const riasecBars = getRiasecBars(scores)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* RIASEC breakdown detail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">Your RIASEC Breakdown</h2>
        <div className="space-y-4">
          {riasecBars.map(({ code, label, score }) => {
            const traits = getTraitDetails(code)
            return (
              <div key={code} className={`border rounded-xl p-4 ${RIASEC_BG_LIGHT[code]}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-black text-sm ${RIASEC_TEXT_COLORS[code]}`}>{label}</span>
                  <span className={`font-black text-lg ${RIASEC_TEXT_COLORS[code]}`}>{score}%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${RIASEC_COLORS[code]}`} style={{ width: `${Math.min(score, 100)}%` }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {traits.map(t => (
                    <span key={t} className={`px-2 py-0.5 rounded-full text-xs font-medium bg-white/70 ${RIASEC_TEXT_COLORS[code]}`}>{t}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Where You Might Struggle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">Where You Might Struggle</h2>
        <ul className="space-y-4">
          {struggles.map((s, i) => (
            <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{s.title}</p>
                <p className="text-sm text-slate-600 mt-0.5">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Growth Recommendations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">Growth Recommendations</h2>
        <ul className="space-y-4">
          {growthRecs.map((r, i) => (
            <li key={i} className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-2xl shrink-0">{r.icon}</span>
              <div>
                <p className="font-bold text-slate-800">{r.title}</p>
                <p className="text-sm text-slate-600 mt-0.5">{r.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Growth Plan Tab ──────────────────────────────────────────────────────────

interface Phase { label: string; timeframe: string; bullets: string[] }

function buildGrowthPhases(userStage: 'school' | 'college' | 'university' | '', topCareerName: string): Phase[] {
  if (userStage === 'school') {
    return [
      { label: 'Phase 1', timeframe: 'This Month', bullets: [`Explore ${topCareerName} online — find 3 YouTube channels run by professionals in the field.`, 'Read about what people in this career actually do day-to-day (not just the title).', 'Write down 3 things that excite you and 3 questions you want answered.'] },
      { label: 'Phase 2', timeframe: 'Next 6 Months', bullets: [`Pick A-Level subjects that align with ${topCareerName} — confirm this with a teacher or counsellor.`, 'Reach out to one professional in this field and ask for a 15-minute conversation.', 'Shadow or visit a workplace if possible to see the environment firsthand.'] },
      { label: 'Phase 3', timeframe: 'Before University', bullets: [`Build one small project or portfolio piece related to ${topCareerName}.`, 'Research which universities in Pakistan offer relevant programs and their entry requirements.', 'Prepare a personal statement draft that connects your interests to this career path.'] },
    ]
  }
  return [
    { label: 'Phase 1', timeframe: 'This Month', bullets: [`Deep-dive the top 3 matched careers — read 10+ real job postings for ${topCareerName} roles.`, 'Identify your top 3 skill gaps and map them to free or affordable resources.', 'Set a weekly learning goal: 2 hours minimum on career-relevant skills.'] },
    { label: 'Phase 2', timeframe: 'Next 6 Months', bullets: [`Start one real project or internship directly related to ${topCareerName}.`, 'Connect with 5 professionals on LinkedIn — engage with their content before cold messaging.', 'Complete one online certification or course that fills a critical skill gap.'] },
    { label: 'Phase 3', timeframe: 'This Year', bullets: [`Build a portfolio showcasing your ${topCareerName} work — case studies, projects, or results.`, 'Apply for at least 2 internships or relevant competitions before year-end.', 'Get one professional reference or mentor relationship established.'] },
  ]
}

const PHASE_COLORS = ['bg-blue-600', 'bg-indigo-600', 'bg-violet-600']

function GrowthPlanTab({ userStage, matchedCareers }: { userStage: 'school' | 'college' | 'university' | ''; matchedCareers: (Career & { match: number; rank: number })[] }) {
  const topCareerName = matchedCareers[0]?.name ?? 'your top career'
  const phases = buildGrowthPhases(userStage, topCareerName)
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Your Growth Plan</h2>
        <p className="text-slate-500 text-sm mt-1">A step-by-step roadmap toward <span className="font-semibold text-slate-700">{topCareerName}</span>.</p>
      </div>
      {phases.map((phase, idx) => (
        <div key={phase.label} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full ${PHASE_COLORS[idx]} text-white text-sm font-black flex items-center justify-center shrink-0`}>{idx + 1}</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{phase.label}</p>
              <p className="font-black text-slate-900">{phase.timeframe}</p>
            </div>
          </div>
          <ul className="space-y-2.5 pl-11">
            {phase.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Coach Tab ────────────────────────────────────────────────────────────────

function CoachTab({ userName, matchedCareers, topStrengths, isReturningUser, scores, archetype, userAge, userGender, userSchool, userGoals, userStage }: {
  userName: string; matchedCareers: (Career & { match: number; rank: number })[]; topStrengths: { name: string; score: number }[]; isReturningUser: boolean; scores: ScoreProfile; archetype: string; userAge: string; userGender: string; userSchool: string; userGoals: string; userStage: 'school' | 'college' | 'university' | ''
}) {
  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <CareerCoachInline
        userName={userName}
        matchedCareers={matchedCareers.slice(0, 5).map(c => ({ name: c.name, match: c.match, category: c.category }))}
        topStrengths={topStrengths}
        isReturningUser={isReturningUser}
        userContext={{ profile: scores, archetype, age: userAge, gender: userGender, school: userSchool, goals: userGoals, stage: userStage }}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ResultsDashboard({
  scores, matchedCareers, topStrengths, topMotivations, topRIASEC, archetype, userName, userStage,
  adaptiveState, authUser, isReturningUser, showUserMenu, setShowUserMenu, onLogout,
  userAge, userGender, userSchool, userGoals, setIsCoachOpen, showClinicalAudit, setShowClinicalAudit,
  radarData, onetScores, onStartOnet, currentSubjects, currentDegree
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashTab>('overview')

  const stageBadge = userStage === 'school' ? 'School' : userStage === 'college' ? 'College' : 'University'
  const initials = (authUser?.name ?? userName).charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
        <div className="flex items-center justify-between px-4 h-[65px]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight">{APP_CONFIG.appName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (typeof window !== 'undefined') window.open('/parent-report', '_blank') }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors"
            >
              <GraduationCap className="w-4 h-4" /> Parent Report
            </button>
            <button
              onClick={() => { if (typeof window !== 'undefined') window.print() }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Export PDF
            </button>
            {authUser && (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 rounded-full focus:outline-none">
                  {authUser.avatar
                    ? <img src={authUser.avatar} alt={authUser.name} className="w-8 h-8 rounded-full object-cover" />
                    : <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                  }
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-10 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 min-w-[160px]">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{authUser.name}</p>
                        {authUser.email && <p className="text-xs text-slate-400 truncate">{authUser.email}</p>}
                      </div>
                      <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-slate-50 rounded-lg transition-colors">Sign out</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-200 shrink-0 sticky top-[65px] h-[calc(100vh-65px)]">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {authUser?.avatar
                ? <img src={authUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                : <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
              }
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{userName}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full">{stageBadge}</span>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              )
            })}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">{adaptiveState.answered_ids.length} questions answered</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5 truncate">{archetype}</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          {activeTab === 'overview' && (
            <OverviewTab
              userName={userName} archetype={archetype} topRIASEC={topRIASEC} scores={scores}
              radarData={radarData} matchedCareers={matchedCareers}
              onetScores={onetScores} onStartOnet={onStartOnet}
              setActiveTab={setActiveTab} userStage={userStage}
            />
          )}
          {activeTab === 'personality' && (
            <PersonalityTab
              archetype={archetype} topRIASEC={topRIASEC}
              topStrengths={topStrengths} topMotivations={topMotivations} radarData={radarData}
              scores={scores} adaptiveState={adaptiveState} showClinicalAudit={showClinicalAudit}
              setShowClinicalAudit={setShowClinicalAudit} setIsCoachOpen={setIsCoachOpen}
            />
          )}
          {activeTab === 'careers' && (
            onetScores
              ? <CareersTab matchedCareers={matchedCareers} scores={scores} onetScores={onetScores} userStage={userStage} userGoals={userGoals} currentSubjects={currentSubjects} currentDegree={currentDegree} />
              : <OnetLockedTeaser onStartOnet={onStartOnet} matchedCareers={matchedCareers} />
          )}
          {activeTab === 'insights' && (
            <InsightsTab topRIASEC={topRIASEC} scores={scores} matchedCareers={matchedCareers} />
          )}
          {activeTab === 'growth' && (
            <GrowthPlanTab userStage={userStage} matchedCareers={matchedCareers} />
          )}
          {activeTab === 'coach' && (
            <CoachTab
              userName={userName} matchedCareers={matchedCareers} topStrengths={topStrengths}
              isReturningUser={isReturningUser} scores={scores} archetype={archetype}
              userAge={userAge} userGender={userGender} userSchool={userSchool}
              userGoals={userGoals} userStage={userStage}
            />
          )}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex print:hidden overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center py-2.5 px-3 gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
            >
              {tab.icon}
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
