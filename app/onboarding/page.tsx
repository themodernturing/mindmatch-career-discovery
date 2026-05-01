"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { APP_CONFIG } from '@/lib/config'
import { Brain, Building2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [age, setAge] = useState('')
  const [educationLevel, setEducationLevel] = useState<'school' | 'college' | 'university'>('school')
  const [schoolCode, setSchoolCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }

    const firstName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Student'

    // Determine role and institution from code
    let role = 'student'
    let institutionId: string | null = null

    if (schoolCode.trim()) {
      const code = schoolCode.trim().toUpperCase()

      if (code.startsWith('ADMIN-')) {
        // Institution admin
        role = 'institution'
        const institutionCode = code.replace('ADMIN-', '')
        const { data: inst } = await supabase
          .from('institutions')
          .select('id')
          .eq('code', institutionCode)
          .single()

        if (!inst) {
          setError('Institution code not found. Please contact your administrator.')
          setLoading(false)
          return
        }
        institutionId = inst.id
      } else {
        // Student with school code
        const { data: inst } = await supabase
          .from('institutions')
          .select('id')
          .eq('code', code)
          .single()

        if (!inst) {
          setError('School code not found. Please check your code or leave it blank.')
          setLoading(false)
          return
        }
        institutionId = inst.id
      }
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        first_name: firstName,
        age: age ? parseInt(age) : null,
        education_level: educationLevel,
        role,
        institution_id: institutionId,
      })

    if (profileError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    if (role === 'institution') {
      router.push('/institution')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="bg-[#0B0C10] min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase leading-none">{APP_CONFIG.appName}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Career Discovery</p>
          </div>
        </div>

        <h2 className="text-4xl font-black tracking-tighter mb-2">Quick setup.</h2>
        <p className="text-slate-400 mb-10">Just a couple of things before we start.</p>

        {/* Age */}
        <div className="mb-8">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Your Age</label>
          <input
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="e.g. 17"
            min="13"
            max="30"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 transition-all"
          />
        </div>

          <div className="mb-8">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">Where are you right now?</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setEducationLevel('school')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${educationLevel === 'school' ? 'border-blue-600 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <div className="font-black text-sm uppercase tracking-wide">School</div>
                <div className="text-xs text-slate-500 mt-1">Grade 8–10 — Matric / O-Level stage</div>
              </button>
              <button
                onClick={() => setEducationLevel('college')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${educationLevel === 'college' ? 'border-blue-600 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <div className="font-black text-sm uppercase tracking-wide">College</div>
                <div className="text-xs text-slate-500 mt-1">Grade 11–12 — Intermediate / A-Levels</div>
              </button>
              <button
                onClick={() => setEducationLevel('university')}
                className={`p-5 rounded-xl border-2 text-left transition-all ${educationLevel === 'university' ? 'border-blue-600 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
              >
                <div className="font-black text-sm uppercase tracking-wide">University</div>
                <div className="text-xs text-slate-500 mt-1">Undergraduate or postgrad</div>
              </button>
            </div>
          </div>

          <div className="mb-10">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
              <Building2 className="w-3 h-3 inline mr-1" />
              {educationLevel === 'school' ? 'School' : educationLevel === 'college' ? 'College' : 'University'} Name
              <span className="text-slate-600 ml-2 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={schoolCode}
              onChange={e => setSchoolCode(e.target.value)}
              placeholder={
                educationLevel === 'school' ? 'Enter your school name' : 
                educationLevel === 'college' ? 'Enter your college name' : 
                'Enter your university name'
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base font-medium placeholder:text-slate-600 focus:outline-none focus:border-blue-600/60 transition-all uppercase tracking-widest"
            />
            <p className="text-xs text-slate-600 mt-2">Enter your institution name. Leave blank if you don&apos;t want to specify.</p>
          </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 text-base font-black bg-blue-600 hover:bg-blue-500 rounded-full shadow-2xl shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white"
        >
          {loading ? 'Setting up...' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}
