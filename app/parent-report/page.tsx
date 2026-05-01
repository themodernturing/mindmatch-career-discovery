"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCareerById } from '@/lib/careers'
import { getTopRIASECCodes, getArchetype, getTopStrengths } from '@/lib/scoring'
import { getRecommendedSubjects } from '@/lib/subjects_recommendation'
import { ScoreProfile } from '@/lib/types'
import { Brain, GraduationCap, Printer } from 'lucide-react'
import { APP_CONFIG } from '@/lib/config'

const RIASEC_LABELS: Record<string, string> = {
  R: 'Hands-On', I: 'Analytical', A: 'Creative', S: 'People-Oriented', E: 'Leadership', C: 'Organised',
}

interface CareerMatchRow {
  career_id: string
  overall_match: number
  rank: number
}

export default function ParentReportPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [studentName, setStudentName] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [scores, setScores] = useState<ScoreProfile | null>(null)
  const [careerMatches, setCareerMatches] = useState<CareerMatchRow[]>([])
  const [printDate] = useState(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }))

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, education_level')
      .eq('id', user.id)
      .single()

    if (!profile) { setError('Profile not found. Please complete the assessment first.'); setLoading(false); return }

    setStudentName(profile.first_name || user.email?.split('@')[0] || 'Student')
    setEducationLevel(profile.education_level || 'school')

    const { data: scoreProfile } = await supabase
      .from('score_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()

    if (!scoreProfile) { setError('No assessment results found. Please complete the assessment first.'); setLoading(false); return }

    setScores(scoreProfile)

    const { data: matches } = await supabase
      .from('career_matches')
      .select('career_id, overall_match, rank')
      .eq('user_id', user.id)
      .order('rank', { ascending: true })
      .limit(3)

    setCareerMatches(matches || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading report...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-slate-700 font-medium mb-4">{error}</p>
        <button onClick={() => router.push('/')} className="text-blue-600 underline text-sm">Go to assessment</button>
      </div>
    </div>
  )

  if (!scores) return null

  const topRIASEC = getTopRIASECCodes(scores)
  const archetype = getArchetype(scores)
  const topStrengths = getTopStrengths(scores).slice(0, 3)
  const subjects = getRecommendedSubjects(topRIASEC)
  const top3Careers = careerMatches.slice(0, 3)

  const riasecLabels = topRIASEC.slice(0, 2).map(c => RIASEC_LABELS[c] || c)

  return (
    <div className="min-h-screen bg-white">
      {/* Print button — hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Report content */}
      <div className="max-w-[720px] mx-auto px-8 py-10 print:px-0 print:py-0">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-xl tracking-tight">{APP_CONFIG.appName}</p>
              <p className="text-xs text-slate-500">Career Assessment Platform</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700">Parent / Guardian Report</p>
            <p className="text-xs text-slate-400">{printDate}</p>
          </div>
        </div>

        {/* Student intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Career Profile: {studentName}
          </h1>
          <p className="text-slate-500 text-sm">
            {educationLevel === 'university' ? 'University student' : 'School student'} · Assessment completed on {APP_CONFIG.appName}
          </p>
        </div>

        {/* Section 1 — Who Your Child Is */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-base font-black text-slate-900 mb-3">Who {studentName} Is</h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Based on their assessment, {studentName} is a <strong>{archetype}</strong> — a personality type that combines
            strong <strong>{riasecLabels[0]}</strong> and <strong>{riasecLabels[1]}</strong> tendencies.
            This means they are naturally drawn to work that involves{' '}
            {riasecLabels[0] === 'Analytical' ? 'research, problem-solving, and logical thinking' :
             riasecLabels[0] === 'Creative' ? 'original thinking, design, and expression' :
             riasecLabels[0] === 'People-Oriented' ? 'helping others, communication, and collaboration' :
             riasecLabels[0] === 'Leadership' ? 'leading teams, persuading others, and building things' :
             riasecLabels[0] === 'Organised' ? 'systems, detail, structure, and precision' :
             'hands-on, practical, and technical work'}, alongside{' '}
            {riasecLabels[1] === 'Analytical' ? 'a strong analytical and investigative mind' :
             riasecLabels[1] === 'Creative' ? 'creative and expressive abilities' :
             riasecLabels[1] === 'People-Oriented' ? 'genuine people skills and empathy' :
             riasecLabels[1] === 'Leadership' ? 'natural leadership instincts' :
             riasecLabels[1] === 'Organised' ? 'a preference for order and precision' :
             'practical, hands-on skills'}.
          </p>
          <div className="flex flex-wrap gap-2">
            <p className="text-xs font-semibold text-slate-500 w-full mb-1">Top strengths identified:</p>
            {topStrengths.map(s => (
              <span key={s.name} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-full">{s.name}</span>
            ))}
          </div>
        </div>

        {/* Section 2 — Top Career Matches */}
        <div className="mb-8">
          <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">2</span>
            Best-Fit Career Paths
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            These careers are where {studentName}&apos;s natural personality, interests, and strengths align most strongly.
            They are not a prescription — they are a starting point for conversation.
          </p>
          <div className="space-y-4">
            {top3Careers.map((match, i) => {
              const career = getCareerById(match.career_id)
              if (!career) return null
              const pathway = career.education_pathways[0]
              return (
                <div key={career.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-black text-slate-900">{career.name}</p>
                      <p className="text-xs text-slate-500">{career.category}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-slate-400">#{i + 1} match</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{career.description}</p>
                  {pathway && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Degree required: <span className="text-slate-700">{pathway.field}</span> <span className="text-slate-400">({pathway.duration})</span>
                      </p>
                      {pathway.universities && pathway.universities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {pathway.universities.map(uni => (
                            <span key={uni} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{uni}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 3 — Subject Roadmap */}
        <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-black text-slate-900 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">3</span>
            What {studentName} Should Study Now
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Based on their personality profile — these are the subjects that will open the right university doors.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">O Level Electives</p>
              <ul className="space-y-1">
                {subjects.oLevelElectives.map(s => (
                  <li key={s} className="text-sm text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">A Level Combination</p>
              <ul className="space-y-1">
                {subjects.aLevelSubjects.map(s => (
                  <li key={s} className="text-sm text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">FSc equivalent: <span className="font-semibold text-slate-700">{subjects.fscStream}</span></p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">University Degrees</p>
              <ul className="space-y-1">
                {subjects.universityMajors.map(s => (
                  <li key={s} className="text-sm text-slate-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 italic">{subjects.justification}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-400">Generated by {APP_CONFIG.appName} · {APP_CONFIG.domain}</p>
          <p className="text-xs text-slate-400">Confidential — for family use</p>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body { background: white; }
          @page { margin: 20mm 15mm; }
          .print\\:hidden { display: none !important; }
          .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
          .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
        }
      `}</style>
    </div>
  )
}
