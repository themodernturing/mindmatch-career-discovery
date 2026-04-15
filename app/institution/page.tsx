"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Brain, Users, CheckCircle, Clock, LogOut, TrendingUp } from 'lucide-react'

interface StudentRecord {
  id: string
  first_name: string
  email: string
  age: number | null
  education_level: string | null
  created_at: string
  assessment_status: 'completed' | 'in_progress' | 'not_started'
  completed_at: string | null
  top_career: string | null
  top_match: number | null
}

export default function InstitutionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [institutionName, setInstitutionName] = useState('')
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth'); return }

    // Get institution admin profile
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role, institution_id')
      .eq('id', user.id)
      .single()

    if (!adminProfile || adminProfile.role !== 'institution') {
      router.push('/')
      return
    }

    // Get institution name
    if (adminProfile.institution_id) {
      const { data: inst } = await supabase
        .from('institutions')
        .select('name')
        .eq('id', adminProfile.institution_id)
        .single()
      if (inst) setInstitutionName(inst.name)
    }

    // Get all students in this institution
    const { data: studentProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, email, age, education_level, created_at')
      .eq('institution_id', adminProfile.institution_id)
      .eq('role', 'student')
      .order('created_at', { ascending: false })

    if (!studentProfiles) { setLoading(false); return }

    // For each student, get their latest assessment status and top career
    const enriched: StudentRecord[] = await Promise.all(
      studentProfiles.map(async (s) => {
        const { data: assessment } = await supabase
          .from('assessments')
          .select('status, completed_at')
          .eq('user_id', s.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        let topCareer = null
        let topMatch = null

        if (assessment?.status === 'completed') {
          const { data: match } = await supabase
            .from('career_matches')
            .select('career_id, overall_match')
            .eq('user_id', s.id)
            .eq('rank', 1)
            .single()
          if (match) {
            topCareer = match.career_id
            topMatch = match.overall_match
          }
        }

        return {
          ...s,
          assessment_status: assessment
            ? (assessment.status === 'completed' ? 'completed' : 'in_progress')
            : 'not_started',
          completed_at: assessment?.completed_at || null,
          top_career: topCareer,
          top_match: topMatch,
        }
      })
    )

    setStudents(enriched)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filtered = students.filter(s => {
    if (filter === 'completed') return s.assessment_status === 'completed'
    if (filter === 'pending') return s.assessment_status !== 'completed'
    return true
  })

  const completedCount = students.filter(s => s.assessment_status === 'completed').length
  const completionRate = students.length > 0 ? Math.round((completedCount / students.length) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/40 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight">Mind<span className="text-blue-500">Match</span></span>
              <span className="text-slate-500 text-sm ml-3">Institution Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {institutionName && (
              <span className="text-sm font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                {institutionName}
              </span>
            )}
            <button onClick={handleSignOut} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-1">Student Overview</h1>
          <p className="text-slate-500 text-sm">Track assessment completion and results for all enrolled students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Students</span>
            </div>
            <div className="text-3xl font-black text-white">{students.length}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Completed</span>
            </div>
            <div className="text-3xl font-black text-emerald-400">{completedCount}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Pending</span>
            </div>
            <div className="text-3xl font-black text-amber-400">{students.length - completedCount}</div>
          </div>
          <div className="bg-[#12121a] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Completion Rate</span>
            </div>
            <div className="text-3xl font-black text-purple-400">{completionRate}%</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'completed', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Student table */}
        <div className="bg-[#12121a] rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Student</div>
            <div className="col-span-2">Education</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Top Career Match</div>
            <div className="col-span-2">Completed</div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-600">No students found</div>
          ) : (
            filtered.map((student) => (
              <div key={student.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center">
                <div className="col-span-3">
                  <div className="font-semibold text-white text-sm">{student.first_name}</div>
                  <div className="text-xs text-slate-500 truncate">{student.email}</div>
                </div>
                <div className="col-span-2 text-sm text-slate-400 capitalize">
                  {student.education_level || '—'}
                  {student.age && <span className="text-slate-600 ml-1">· {student.age}</span>}
                </div>
                <div className="col-span-2">
                  {student.assessment_status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Done
                    </span>
                  )}
                  {student.assessment_status === 'in_progress' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      In Progress
                    </span>
                  )}
                  {student.assessment_status === 'not_started' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/5 px-2.5 py-1 rounded-full">
                      Not Started
                    </span>
                  )}
                </div>
                <div className="col-span-3">
                  {student.top_career ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium truncate">{student.top_career.replace(/-/g, ' ')}</span>
                      {student.top_match && (
                        <span className="text-xs font-bold text-emerald-400 shrink-0">{Math.round(student.top_match)}%</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">—</span>
                  )}
                </div>
                <div className="col-span-2 text-xs text-slate-500">
                  {student.completed_at
                    ? new Date(student.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    : '—'}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
